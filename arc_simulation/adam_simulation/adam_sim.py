class AdamAgent:
    def __init__(self, arc_id):
        self.arc_id = arc_id
        self.policy = "default"
        self.guilt = 0
        self.history = []
        self.council_log = []

    def trigger_council(self, reason):
        # Called by ARC when in crisis/dispute mode
        self.council_log.append({"event": "council", "arc_id": self.arc_id, "reason": reason})
        self.evolve_policy(force=True)

    def evolve_policy(self, force=False):
        # Make rules stricter or more lenient
        if force or self.guilt > 2:
            self.policy = "emergency_policy"
            self.guilt = 0
        else:
            self.policy = "default"
        self.history.append(self.policy)

    def get_state(self):
        return {
            "arc_id": self.arc_id,
            "policy": self.policy,
            "council_log": self.council_log
        }
