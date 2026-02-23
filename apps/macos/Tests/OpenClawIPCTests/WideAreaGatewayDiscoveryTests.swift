import Darwin
import Testing
@testable import OpenPawDiscovery

@Suite
struct WideAreaGatewayDiscoveryTests {
    @Test func discoversBeaconFromTailnetDnsSdFallback() {
        setenv("OPENPAW_WIDE_AREA_DOMAIN", "openpaw.internal", 1)
        let statusJson = """
        {
          "Self": { "TailscaleIPs": ["100.69.232.64"] },
          "Peer": {
            "peer-1": { "TailscaleIPs": ["100.123.224.76"] }
          }
        }
        """

        let context = WideAreaGatewayDiscovery.DiscoveryContext(
            tailscaleStatus: { statusJson },
            dig: { args, _ in
                let recordType = args.last ?? ""
                let nameserver = args.first(where: { $0.hasPrefix("@") }) ?? ""
                if recordType == "PTR" {
                    if nameserver == "@100.123.224.76" {
                        return "steipetacstudio-gateway._openpaw-gw._tcp.openpaw.internal.\n"
                    }
                    return ""
                }
                if recordType == "SRV" {
                    return "0 0 18789 steipetacstudio.openpaw.internal."
                }
                if recordType == "TXT" {
                    return "\"displayName=Peter\\226\\128\\153s Mac Studio (OpenPaw)\" \"gatewayPort=18789\" \"tailnetDns=peters-mac-studio-1.sheep-coho.ts.net\" \"cliPath=/Users/steipete/openpaw/src/entry.ts\""
                }
                return ""
            })

        let beacons = WideAreaGatewayDiscovery.discover(
            timeoutSeconds: 2.0,
            context: context)

        #expect(beacons.count == 1)
        let beacon = beacons[0]
        let expectedDisplay = "Peter\u{2019}s Mac Studio (OpenPaw)"
        #expect(beacon.displayName == expectedDisplay)
        #expect(beacon.port == 18789)
        #expect(beacon.gatewayPort == 18789)
        #expect(beacon.tailnetDns == "peters-mac-studio-1.sheep-coho.ts.net")
        #expect(beacon.cliPath == "/Users/steipete/openpaw/src/entry.ts")
    }
}
