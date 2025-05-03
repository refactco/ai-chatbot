const ss = [
  {
    event: 'delta',
    data: {
      type: 'user_message',
      content:
        'I had a call with Sandbox client, they asked me to add a new feature for their magazine, create the tasks for it',
      id: '0',
    },
  },

  {
    event: 'delta',
    data: {
      type: 'assistant_message',
      content:
        "You're asking me to create tasks for a new feature for Sandbox's magazine, do they mentioned a specific deadline?",
      id: '1',
    },
  },

  {
    event: 'delta',
    data: {
      type: 'user_message',
      content: 'They want it for next week',
      human_in_the_loop: { message_id: '1' },
      id: '2',
    },
  },

  {
    event: 'delta',
    data: {
      type: 'assistant_message',
      content: "OK, I'm looking for Sandbox project first...",
      id: '3',
    },
  },

  {
    event: 'delta',
    data: {
      type: 'assistant_message',
      content: "I'm creating these tasks in Sandbox project:",
      tool_result: {
        data: [
          {
            name: 'Design UI of new feature',
            description: 'Design the UI of the new feature on figma',
            due_on: '2025-05-08',
          },
          {
            name: 'Implement the front-end of the new feature',
            description: 'Implement the front-end side of the new feature',
            due_on: '2025-05-08',
          },
          {
            name: 'Implement the back-end of the new feature',
            description: 'Implement the back-end side of the new feature',
            due_on: '2025-05-08',
          },
        ],
      },
      id: '4',
    },
  },
  {
    event: 'delta',
    data: {
      type: 'user_message',
      content: 'They want it for next week',
      human_in_the_loop: {
        message_id: '4',
        data: [
          {
            name: 'Design UI of new feature',
            description: 'Design the UI of the new feature on figma',
            due_on: '2025-05-08',
            status: 'accepted',
          },
          {
            name: 'Implement the front-end of the new feature',
            description: 'Implement the front-end side of the new feature',
            due_on: '2025-05-08',
            status: 'accepted',
          },
          {
            name: 'Implement the back-end of the new feature',
            description: 'Implement the back-end side of the new feature',
            due_on: '2025-05-08',
            status: 'accepted',
          },
        ],
      },
      id: '5',
    },
  },
  {
    event: 'delta',
    data: {
      type: 'assistant_message',
      content: 'Listing the available people from the team...',
      tool_result: {
        data: [
          {
            name: 'Hamidreza Amini',
          },
          {
            name: 'Asghar Mirzaei',
          },
          {
            name: 'Alireza Arjvand',
          },
        ],
      },
      id: '6',
    },
  },
  {
    event: 'delta',
    data: {
      type: 'assistant_message',
      content: 'Finding the best person ...',
      id: '7',
    },
  },
  {
    event: 'delta',
    data: {
      type: 'assistant_message',
      content:
        'Alright, I assigned the task to Asghar Mirzaei, I added next Monday as the deadline. Let me know if you need anything else, or change anything.',
      id: '8',
    },
  },
];
