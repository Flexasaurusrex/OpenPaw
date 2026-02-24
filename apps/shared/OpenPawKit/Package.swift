// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "OpenPawKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "OpenPawProtocol", targets: ["OpenPawProtocol"]),
        .library(name: "OpenPawKit", targets: ["OpenPawKit"]),
        .library(name: "OpenPawChatUI", targets: ["OpenPawChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.0"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "OpenPawProtocol",
            path: "Sources/OpenPawProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "OpenPawKit",
            dependencies: [
                "OpenPawProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/OpenPawKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "OpenPawChatUI",
            dependencies: [
                "OpenPawKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/OpenPawChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "OpenPawKitTests",
            dependencies: ["OpenPawKit", "OpenPawChatUI"],
            path: "Tests/OpenPawKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
