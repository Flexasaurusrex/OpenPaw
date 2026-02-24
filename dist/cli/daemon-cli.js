// Legacy shim for pre-tsdown update-cli imports.
import * as daemonCli from "../daemon-cli-CeMDN5dn.js";
export const registerDaemonCli = daemonCli.t.registerDaemonCli;
export const runDaemonInstall = daemonCli.s;
export const runDaemonRestart = daemonCli.r;
export const runDaemonStart = async () => { throw new Error("Legacy daemon CLI export \"runDaemonStart\" is unavailable in this build. Please upgrade OpenPaw."); };
export const runDaemonStatus = async () => { throw new Error("Legacy daemon CLI export \"runDaemonStatus\" is unavailable in this build. Please upgrade OpenPaw."); };
export const runDaemonStop = async () => { throw new Error("Legacy daemon CLI export \"runDaemonStop\" is unavailable in this build. Please upgrade OpenPaw."); };
export const runDaemonUninstall = async () => { throw new Error("Legacy daemon CLI export \"runDaemonUninstall\" is unavailable in this build. Please upgrade OpenPaw."); };
