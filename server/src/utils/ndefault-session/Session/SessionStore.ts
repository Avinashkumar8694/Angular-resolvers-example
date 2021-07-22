import { LessThan, Repository } from 'typeorm';
import { Store } from 'express-session';

export class TypeormStore extends Store {
	private readonly repository: Repository<SessionEntity>;
	private readonly ttl?: number;
	private readonly expirationInterval: number;
	private expirationIntervalId?: NodeJS.Timeout;

	constructor(options) {
		super(options);

		if (!options.repository) {
			throw new Error('The repository option is required');
		}

		this.repository = options.repository;
		this.ttl = options.ttl;
		this.expirationInterval = options.expirationInterval || 86400;

		if (options.clearExpired === undefined || options.clearExpired) {
			this.setExpirationInterval(this.expirationInterval);
		}
	}

	/**
	 * Get all sessions.
	 * @param {(error: any, result?: any) => void} callback
	 */
	all = (callback: (error: any, result?: any) => void): void => {
		this.repository
			.find()
			.then((sessions: SessionEntity[]) => sessions.map(session => JSON.parse(session.json)))
			.then((data: any) => callback(null, data))
			.catch((error: any) => callback(error));
	};

	/**
	 * Destroy a session
	 * @param {string} id
	 * @param {(error: any) => void} callback
	 */
	destroy = (id: string, callback?: ((error: any) => void)): void => {
		this.repository
			.delete(id)
			.then(() => callback && callback(null))
			.catch((error: any) => callback && callback(error));
	};

	/**
	 * Clear all sessions.
	 * @param {(error: any) => void} callback
	 */
	clear = (callback?: ((error: any) => void)): void => {
		this.repository
			.clear()
			.then(() => callback && callback(null))
			.catch((error: any) => callback && callback(error));
	};

	/**
	 * Get the session count.
	 * @param {(error: any, length?: number) => void} callback
	 */
	length = (callback: (error: any, length: number) => void): void => {
		this.repository
			.count()
			.then((length: number) => callback(null, length))
			.catch((error: any) => callback(error, 0));
	};

	/**
	 * Get a session.
	 * @param {string} id
	 * @param {(error: any, session?: any) => any} callback
	 */
	get = (id: string, callback: (error: any, session?: any) => void): void => {
		this.repository
			.findOne(id)
			.then((session: SessionEntity | undefined) => {
				if (!session) {
					return callback(null);
				}
				const data = JSON.parse(session.json);
				callback(null, data);
			})
			.catch((error: any) => callback(error));
	};

	/**
	 * Set a session.
	 * @param {string} id
	 * @param session
	 * @param {(error: any) => void} callback
	 */
	set = (id: string, session: any, callback?: ((error: any) => void)): void => {
		let json;
		try {
			json = JSON.stringify(session);
		} catch (error) {
			if (callback) {
				return callback(error);
			}
			throw error;
		}
		const ttl = this.getTTL(session);
		const expiresAt = Math.floor(new Date().getTime() / 1000) + ttl;
		this.repository
			.save({ id, json, expiresAt })
			.then(() => callback && callback(null))
			.catch((error: any) => callback && callback(error));
	};

	/**
	 * Refresh the session expiry time.
	 * @param {string} id
	 * @param session
	 * @param {(error: any) => void} callback
	 */
	touch = (id: string, session: any, callback?: ((error: any) => void)): void => {
		const ttl = this.getTTL(session);
		const expiresAt = Math.floor(new Date().getTime() / 1000) + ttl;

		this.repository
			.update(id, { expiresAt })
			.then(() => callback && callback(null))
			.catch((error: any) => callback && callback(error));
	};

	clearExpiredSessions = (callback?: (error: any) => void) => {
		const timestamp: any = Math.round(new Date().getTime() / 1000);
		this.repository
			.createQueryBuilder("session")
			.where("expiresAt < :expiresAt ", { expiresAt: timestamp })
			.delete()
			.execute()
			.then(() => callback && callback(null))
			.catch((error: any) => callback && callback(error));
	};

	setExpirationInterval = (interval?: number) => {
		interval = interval || this.expirationInterval;

		this.clearExpirationInterval();
		this.expirationIntervalId = setInterval(this.clearExpiredSessions, interval)
	};

	clearExpirationInterval = () => {
		if (this.expirationIntervalId) {
			clearInterval(this.expirationIntervalId);
		}

		this.expirationIntervalId = undefined;
	};

	private getTTL = (session: any): number => {
		if (this.ttl) {
			return this.ttl;
		}
		return session.cookie && session.cookie.maxAge
			? Math.floor(session.cookie.maxAge / 1000)
			: 86400;
	};
}

export interface SessionEntity {
	/**
	 * The randomly generated session ID.
	 */
	id: string;

	/**
	 * The UNIX timestamp at which the session will expire.
	 */
	expiresAt: number;

	/**
	 * The JSON data of the session.
	 */
	json: string;
}
export interface IExpressSession {
	secret: string;
	cookie?: any;
	name?: string;
	resave?: boolean;
	saveUninitialized?: boolean;
	proxy?: boolean | undefined;
	rolling?: boolean;
	unset?: 'destroy' | 'keep';
	store?: any;
	// genid?: Function
}