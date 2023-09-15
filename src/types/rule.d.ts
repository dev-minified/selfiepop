type RuleEventTypes = 'membership_join' | 'tag_added' | 'tag_removed';
type EventTrigger = {
  trigger?: string;
  memberShipType?: string;
  days?: number;
};

type ConditionCheck = {
  tagPresent?: string[];
  tagNotPresent?: string[];
};

type conditionAction = {
  tagAdd?: string[];
  tagRemove?: string[];
  post?: IPost[];
  message?: ChatMessage[];
};
type RULE = {
  title?: string;
  triggerElement?: EventTrigger;
  tagePresent?: string[];
  tageNotPresent?: string[];
  conditionCheck?: ConditionCheck;
  conditionAction?: conditionAction;
};

type RuleMetadata = {
  title: string;
  description: string;
  trigger: {
    event: typeof RuleEventTypes;
    membershipType: string;
    daysToWait: number;
    tag: string;
  };
  conditions: {
    includedTags: string[];
    excludedTags: string[];
  };
  actions: {
    addTags: string[];
    removeTags: string[];
    addPosts: IPost[];
    addMessages: ChatMessage[];
    addTasks: Task[];
  };
  id: string;
  sellerId?: string;
  isActive?: boolean;
};

type Rule = {
  isActive?: boolean;
  metadata: RuleMetadata;
  slug: string;
  id: string;
  createdAt: number;
};
