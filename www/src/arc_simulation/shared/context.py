class MessageBus:
    def __init__(self):
        self.events = []

    def post_event(self, event):
        self.events.append(event)

    def get_events_for_arc(self, arc_id):
        return [e for e in self.events if e.get("target_arc") == arc_id]

    def resolve_cross_arc_events(self, network):
        # Clear after handling; you can expand for actual dispute resolution
        self.events = []

    def get_state(self):
        return {"events": self.events}
