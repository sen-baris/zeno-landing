// A synthetic rollout used to explain what adoption visibility looks like. These figures are not
// customer evidence, a benchmark, or a Zeno result. Any surface that renders them must say so.
export const illustrativeAdoptionScenario = {
  status: 'draft',
  label: 'Illustrative rollout',
  health: 'Healthy adoption',
  series: {
    label: 'Weekly active users',
    period: 'Week 1 to week 12',
    values: [21, 27, 33, 36, 40, 45, 48, 52, 55, 58, 61, 64],
  },
  metrics: {
    weeklyActive: {
      label: 'Weekly active',
      value: '64%',
      direction: 'up',
      delta: 'from 21% in month one',
    },
    messagesPerActiveUser: {
      label: 'Messages per active user',
      value: '31',
      direction: 'up',
      delta: 'from 9 at launch',
    },
    returningTeams: {
      label: 'Teams using it twice',
      value: '11 of 14',
      direction: 'up',
      delta: 'up from 3',
    },
    inactiveSeats: {
      label: 'Seats idle 30 days',
      value: '9%',
      direction: 'down',
      delta: 'down from 46%',
    },
  },
} as const;
