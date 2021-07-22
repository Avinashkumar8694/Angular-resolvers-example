import * as nodemailer from 'nodemailer';
// import * as POP3Client from 'poplib';
import * as MailParser from 'mailparser';
// import * as Imap from 'imap';

let EmailServiceInstance: EmailOutService = null;
let __simpleParser: any;
export class EmailOutService {
    // private __simpleParser: any;

    constructor() {}

    static getInstance(): EmailOutService {
        if (!EmailServiceInstance) {
            
            EmailServiceInstance = new EmailOutService();
            __simpleParser = MailParser.simpleParser;
        }
        return EmailServiceInstance;
    }

    sendEmail(serverOptions: {
        server: string,
        port: number,
        secure: boolean,
        tls: boolean
    }, emailOptions: {
        userid: string,
        password: string,
        to: string,
        subject: string,
        body?: any,
        cc?: string,
        bcc?: string,
        from?: string,
        html?: any,
        iCal?: any,
        routingOptions?: any,
        contentOptions?: any,
        securityOptions?: any,
        headerOptions?: any,
        filename?: any,
        attachments?: any
        
    }) {
        return new Promise((resolve, reject) => {
            let smtpOptions: {
                host: string,
                port: number,
                secure: boolean,
                tls: boolean,
                auth?: {
                    user: string,
                    pass: string
                }
            } = {
                host: serverOptions.server,
                port: serverOptions.port,
                secure: serverOptions.secure,
                tls: serverOptions.tls
            };

            if (emailOptions.userid && emailOptions.password) {
                smtpOptions.auth = {
                    user: emailOptions.userid,
                    pass: emailOptions.password
                }
            }

            let sendopts: any = { from: emailOptions.from || emailOptions.userid };
            sendopts.to = emailOptions.to;
            sendopts.subject = emailOptions.subject;
            if (emailOptions.cc) {sendopts.cc = emailOptions.cc};
            if (emailOptions.bcc) {sendopts.bcc = emailOptions.bcc};

            if (emailOptions.routingOptions && emailOptions.routingOptions.sender) {sendopts.sender = emailOptions.routingOptions.sender;}
            if (emailOptions.routingOptions && emailOptions.routingOptions.replyTo) {sendopts.replyTo = emailOptions.routingOptions.replyTo;}
            if (emailOptions.routingOptions && emailOptions.routingOptions.inReplyTo) {sendopts.inReplyTo = emailOptions.routingOptions.inReplyTo;}
            if (emailOptions.routingOptions && emailOptions.routingOptions.references) {sendopts.references = emailOptions.routingOptions.references;}
            if (emailOptions.routingOptions && emailOptions.routingOptions.envelope) {sendopts.envelope = emailOptions.routingOptions.envelope;}

            if (emailOptions.contentOptions && emailOptions.contentOptions.attachDataUrls) {sendopts.attachDataUrls = emailOptions.contentOptions.attachDataUrls;}
            if (emailOptions.contentOptions && emailOptions.contentOptions.watchHtml) {sendopts.watchHtml = emailOptions.contentOptions.watchHtml;}
            if (emailOptions.contentOptions && emailOptions.contentOptions.amp) {sendopts.amp = emailOptions.contentOptions.amp;}
            if (emailOptions.contentOptions && emailOptions.contentOptions.encoding) {sendopts.encoding = emailOptions.contentOptions.encoding;}
            if (emailOptions.contentOptions && emailOptions.contentOptions.raw) {sendopts.raw = emailOptions.contentOptions.raw;}
            if (emailOptions.contentOptions && emailOptions.contentOptions.textEncoding) {sendopts.textEncoding = emailOptions.contentOptions.textEncoding;}
            if (emailOptions.contentOptions && emailOptions.contentOptions.alternatives) {sendopts.alternatives = emailOptions.contentOptions.alternatives;}

            if (emailOptions.headerOptions && emailOptions.headerOptions.priority) {sendopts.priority = emailOptions.headerOptions.priority;}
            if (emailOptions.headerOptions && emailOptions.headerOptions.headers) {sendopts.headers = emailOptions.headerOptions.headers;}
            if (emailOptions.headerOptions && emailOptions.headerOptions.messageId) {sendopts.messageId = emailOptions.headerOptions.messageId;}
            if (emailOptions.headerOptions && emailOptions.headerOptions.date) {sendopts.date = emailOptions.headerOptions.date;}
            if (emailOptions.headerOptions && emailOptions.headerOptions.list) {sendopts.list = emailOptions.headerOptions.list;}

            if (emailOptions.securityOptions && emailOptions.securityOptions.disableFileAccess) {sendopts.disableFileAccess = emailOptions.securityOptions.disableFileAccess;}
            if (emailOptions.securityOptions && emailOptions.securityOptions.disableUrlAccess) {sendopts.disableUrlAccess = emailOptions.securityOptions.disableUrlAccess;}

            if (emailOptions.html) {sendopts.html = emailOptions.html;}
            if (emailOptions.iCal) {sendopts.icalEvent = emailOptions.iCal;}

            let smtpTransport = nodemailer.createTransport(smtpOptions);
            let payload;
            if (Buffer.isBuffer(emailOptions.body)) {
                if (!emailOptions.filename) {
                    let fe = 'bin';
                    if ((emailOptions.body[0] === 0xFF) && (emailOptions.body[1] === 0xD8)) { fe = "jpg"; }
                    if ((emailOptions.body[0] === 0x47) && (emailOptions.body[1] === 0x49)) { fe = "gif"; } //46
                    if ((emailOptions.body[0] === 0x42) && (emailOptions.body[1] === 0x4D)) { fe = "bmp"; }
                    if ((emailOptions.body[0] === 0x89) && (emailOptions.body[1] === 0x50)) { fe = "png"; } //4E
                    emailOptions.filename = "attachment." + fe;
                }
                let fname = emailOptions.filename.replace(/^.*[\\\/]/, '') || 'file.bin';
                sendopts.attachments = [{
                    content: emailOptions.body,
                    filename: fname
                }]
                if (emailOptions.headerOptions.headers['content-type']) {
                    sendopts.attachments[0].contentType = emailOptions.headerOptions.headers['content-type'];
                }
                // sendopts.text = emailOptions.defaultMessage || 'Default generated messages.';
            } else { 
                sendopts.text = '' + emailOptions.body;
                if (/<[a-z][\s\S]*>/i.test(payload)) { sendopts.html = sendopts.text };
                if (emailOptions.attachments) { sendopts.attachments = emailOptions.attachments };
            }
            smtpTransport.sendMail(sendopts, function (error, info) {
                if (error) {
                    return reject(error);
                }
                return resolve(info);
            });
        })
    }
}