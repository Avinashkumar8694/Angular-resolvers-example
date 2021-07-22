'use strict'
import * as ActiveDirectory from 'activedirectory';
import { StatusCodes as HttpStatus } from 'http-status-codes';

export class ActiveDirectoryAuthService {
    constructor() {}

    /**
     * Authenticates the username and password by doing a simple bind with the specified credentials.
     * @param userPrincipalName 
     * @param sAMAccountName 
     * @param password 
     * @param activeDirectoryConfig 
     */
    authenticate(activeDirectoryConfig, userPrincipalName, sAMAccountName, password) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.authenticate(userPrincipalName, password, (error, auth) => {
                if (error) {
                    if (error.code == 49) {
                        return reject({ status: HttpStatus.UNAUTHORIZED, error: "Invalid username and / or password." });
                    } else {
                        return reject({ status: HttpStatus.INTERNAL_SERVER_ERROR, error: error });
                    }
                }
                if (!auth) {
                    return reject({ status: HttpStatus.UNAUTHORIZED, error: "Invalid username and / or password." });
                }
                else {
                    this.__getUserAccount(adInstance, sAMAccountName, userPrincipalName).then(account => {
                        return resolve(account);
                    }, error => {
                        return reject(error);
                    });
                }
            })
        });
    }

    __getUserAccount(adInstance, sAMAccountName, userPrincipalName) {
        return new Promise((resolve, reject) => {
            adInstance.findUser(sAMAccountName, (findUserError, user) => {
                if (findUserError) {
                    return reject({ status: HttpStatus.INTERNAL_SERVER_ERROR, error: findUserError });
                }
                if (!user) {
                    return reject({ status: HttpStatus.INTERNAL_SERVER_ERROR, error: "User lookup failed for account name :: " + sAMAccountName });
                }
                return resolve(user);
            });
        });
    }

    isUserMemberOf(activeDirectoryConfig, username, groupName) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.isUserMemberOf(username, groupName, function (err, isMember) {
                if (err) {
                    return reject(err);
                }
                return resolve(isMember);
            })
        })
    }

    /**
     * Perform a generic search for the specified LDAP query filter.
     * This function will return both groups and users that match the
     *  specified filter. Any results not recognized as a user or group
     *  (i.e. computer accounts, etc.) can be found in the 'other' attribute
     *  / array of the result.
     */
    find(activeDirectoryConfig, query) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.find(query, function (err, results) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }

    /**
     * Looks up or finds a username by their sAMAccountName, userPrincipalName,
     *  distinguishedName (dn) or custom filter. If found, the returned object 
     * contains all of the requested attributes. By default, the following attributes
     *  are returned:
     *  userPrincipalName, sAMAccountName, mail, lockoutTime, whenCreated, pwdLastSet,
     *  userAccountControl, employeeID, sn, givenName, initials, cn, displayName, comment,
     *  description
     */
    findUser(activeDirectoryConfig, sAMAccountName) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.findUser(sAMAccountName, function (err, results) {
                if (err) {
                    return reject(err);
                }
                if (results && results.sAMAccountName) {
                    return resolve(results);
                }
                return resolve(null);
            })
        })
    }

    /**
     * Looks up or find a group by common name (CN) which is required to be unique
     *  in Active Directory or optionally by the distinguished name. Supports groups
     *  with range retrieval specifiers. The following attributes are returned by default
     *  for the group:
     *  objectCategory, distinguishedName, cn, description, member
     */
    findGroup(activeDirectoryConfig, groupName) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.findGroup(groupName, function (err, results) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }

    /**
     * Perform a generic search for users that match the specified filter. The default LDAP filter
     *  for users is specified as 
     * (&(|(objectClass=user)(objectClass=person))(!(objectClass=computer))(!(objectClass=group)))
     * @param query 
     * @param activeDirectoryConfig 
     */
    findUsers(activeDirectoryConfig, query) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.findUsers(query, (err, results) => {
                if (err) {
                    return reject(err);
                }
 
                return resolve(this.getUsers(results));
            })
        })
    }

    /**
     * Perform a generic search for groups that match the specified filter. The default LDAP filter for
     *  groups is specified as 
     * (&(objectClass=group)(!(objectClass=computer))(!(objectClass=user))(!(objectClass=person)))
     */
    findGroups(activeDirectoryConfig, query) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.findGroups(query, function (err, results) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }

    /**
     * Checks to see if the specified group exists.
     */
    groupExists(activeDirectoryConfig, groupName) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.groupExists(groupName, function (err, results) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }

    /**
     * Checks to see if the specified user exists.
     */
    userExists(activeDirectoryConfig, username) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.userExists(username, function (err, results) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }

    /**
     * For the specified group, retrieve all of the groups
     *  that the group is a member of. If a retrieved group
     *  is a member of another group, then that group is 
     * recursively retrieved as well to build a complete 
     * hierarchy of groups that a user belongs to.
     */
    getGroupMembershipForGroup(activeDirectoryConfig, groupName) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.getGroupMembershipForGroup(groupName, function (err, results) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }

    /**
     * For the specified username, retrieve all of the groups
     * that a user belongs to. If a retrieved group is a member
     * of another group, then that group is recursively retrieved
     *  as well to build a complete hierarchy of groups that a user belongs to.
     */
    getGroupMembershipForUser(activeDirectoryConfig, sAMAccountName) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.getGroupMembershipForUser(sAMAccountName, function (err, results) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }

    /**
     * For the specified group, retrieve all of the users that belong
     *  to the group. If the group contains groups, then the members of
     *  those groups are recursively retrieved as well to build a complete
     *  list of users that belong to the specified group.
     */
    getUsersForGroup(activeDirectoryConfig, groupName) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.getUsersForGroup(groupName, (err, results) => {
                if (err) {
                    return reject(err);
                }
                return resolve(this.getUsers(results));
            })
        })
    }

    /**
     * Retrieves the root DSE for the specified url. Can be called statically.
     */
    getRootDSE(activeDirectoryConfig) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.getRootDSE(function (err, results) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            })
        })
    }

    /**
     * If tombstoning (recycle bin) is enabled for the Active Directory installation,
     *  use findDeletedObjects to retrieve items in the recycle bin.
     * More information about tombstoning and enabling can be found at:
     * Enable the Active Directory Recycle Bin (and other New Features)
     * Reanimating Active Directory Tombstone Objects
     * Note: That when an LDAP entry / object is tombstoned, not all attributes for
     * that item are retained. This is a limitation of Active Directory itself and not
     * the library itself.
     * var url = 'ldap://yourdomain.com';
     * var opts = {
     *      baseDN: 'ou=Deleted Objects, dc=yourdomain, dc=com',
     *      filter: 'cn=*Bob*'
     * };
     */
    findDeletedObjects(activeDirectoryConfig, opts) {
        return new Promise((resolve, reject) => {
            const adInstance = new ActiveDirectory(activeDirectoryConfig);
            adInstance.findDeletedObjects(opts, function (err, results) {
                if (err) {
                    return reject(err);
                }
                return resolve(results);
            });
        });
    }

    private getUsers(results) {
        let users = [];
        if (results instanceof Array) {
            for (let i = 0; i < results.length; i++) {
                if (results[i].sAMAccountName) {
                    users.push(results[i]);
                }
            }
        }
        return users;
    }
}