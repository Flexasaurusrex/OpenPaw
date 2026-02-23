// swift-tools-version: 6.2
// Package manifest for the OpenPaw macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "OpenPaw",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "OpenPawIPC", targets: ["OpenPawIPC"]),
        .library(name: "OpenPawDiscovery", targets: ["OpenPawDiscovery"]),
        .executable(name: "OpenPaw", targets: ["OpenPaw"]),
        .executable(name: "openpaw-mac", targets: ["OpenPawMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/OpenPawKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "OpenPawIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "OpenPawDiscovery",
            dependencies: [
                .product(name: "OpenPawKit", package: "OpenPawKit"),
            ],
            path: "Sources/OpenPawDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "OpenPaw",
            dependencies: [
                "OpenPawIPC",
                "OpenPawDiscovery",
                .product(name: "OpenPawKit", package: "OpenPawKit"),
                .product(name: "OpenPawChatUI", package: "OpenPawKit"),
                .product(name: "OpenPawProtocol", package: "OpenPawKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/OpenPaw.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "OpenPawMacCLI",
            dependencies: [
                "OpenPawDiscovery",
                .product(name: "OpenPawKit", package: "OpenPawKit"),
                .product(name: "OpenPawProtocol", package: "OpenPawKit"),
            ],
            path: "Sources/OpenPawMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "OpenPawIPCTests",
            dependencies: [
                "OpenPawIPC",
                "OpenPaw",
                "OpenPawDiscovery",
                .product(name: "OpenPawProtocol", package: "OpenPawKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
