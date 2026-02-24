import Foundation

public enum OpenPawRemindersCommand: String, Codable, Sendable {
    case list = "reminders.list"
    case add = "reminders.add"
}

public enum OpenPawReminderStatusFilter: String, Codable, Sendable {
    case incomplete
    case completed
    case all
}

public struct OpenPawRemindersListParams: Codable, Sendable, Equatable {
    public var status: OpenPawReminderStatusFilter?
    public var limit: Int?

    public init(status: OpenPawReminderStatusFilter? = nil, limit: Int? = nil) {
        self.status = status
        self.limit = limit
    }
}

public struct OpenPawRemindersAddParams: Codable, Sendable, Equatable {
    public var title: String
    public var dueISO: String?
    public var notes: String?
    public var listId: String?
    public var listName: String?

    public init(
        title: String,
        dueISO: String? = nil,
        notes: String? = nil,
        listId: String? = nil,
        listName: String? = nil)
    {
        self.title = title
        self.dueISO = dueISO
        self.notes = notes
        self.listId = listId
        self.listName = listName
    }
}

public struct OpenPawReminderPayload: Codable, Sendable, Equatable {
    public var identifier: String
    public var title: String
    public var dueISO: String?
    public var completed: Bool
    public var listName: String?

    public init(
        identifier: String,
        title: String,
        dueISO: String? = nil,
        completed: Bool,
        listName: String? = nil)
    {
        self.identifier = identifier
        self.title = title
        self.dueISO = dueISO
        self.completed = completed
        self.listName = listName
    }
}

public struct OpenPawRemindersListPayload: Codable, Sendable, Equatable {
    public var reminders: [OpenPawReminderPayload]

    public init(reminders: [OpenPawReminderPayload]) {
        self.reminders = reminders
    }
}

public struct OpenPawRemindersAddPayload: Codable, Sendable, Equatable {
    public var reminder: OpenPawReminderPayload

    public init(reminder: OpenPawReminderPayload) {
        self.reminder = reminder
    }
}
