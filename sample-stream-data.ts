const mockStreamData = [
  {
    event: 'delta',
    data: {
      role: 'user',
      content:
        'I had a call with Sandbox client, they asked me to add a new feature for their magazine, create the tasks for it',
      id: '0',
    },
  },
  {
    event: 'delta',
    data: {
      role: 'assistant',
      content:
        "You're asking me to create tasks for a new feature for Sandbox's magazine, do they mentioned a specific deadline?",
      id: '1',
    },
  },
  {
    event: 'delta',
    data: {
      role: 'user',
      content: 'They want it for next week',
      id: '2',
    },
  },
  {
    event: 'delta',
    data: {
      role: 'assistant',
      content: "OK, I'm looking for Sandbox project first...",
      id: '3',
    },
  },
  {
    event: 'delta',
    data: {
      role: 'assistant',
      content: "I'm creating these tasks in Sandbox project:",
      tool_calls: {
        type: 'request',
        title: "I'm creating these tasks in Sandbox project:",
        items: [
          {
            name: 'Design UI of new feature',
          },
          // {
          //   name: 'Implement the front-end of the new feature',
          // },
          // {
          //   name: 'Implement the back-end of the new feature',
          // },
        ],
      },
      id: '4',
    },
  },
  {
    event: 'delta',
    data: {
      role: 'user',
      tool_calls: {
        type: 'confirm',
        message_id: '4',
        data: [
          {
            name: 'Design UI of new feature',
            status: 'accepted',
          },
          {
            name: 'Implement the front-end of the new feature',
            status: 'accepted',
          },
          {
            name: 'Implement the back-end of the new feature',
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
      role: 'assistant',
      content: 'Listing the available people from the team...',
      tool_calls: {
        type: 'result',
        title: 'I found these people in the team',
        items: [
          { name: 'Hamidreza Amini' },
          { name: 'Asghar Mirzaei' },
          { name: 'Alireza Arjvand' },
        ],
      },
      id: '6',
    },
  },
  {
    event: 'delta',
    data: {
      role: 'assistant',
      content: 'Finding the best person ...',
      id: '7',
    },
  },
  {
    event: 'delta',
    data: {
      role: 'assistant',
      content:
        'Alright, I assigned the task to Asghar Mirzaei, I added next Monday as the deadline. Let me know if you need anything else, or change anything.',
      tool_calls: {
        type: 'request',
        title: "I'm updating the task list:",
        items: [
          {
            gid: '1',
            name: 'Design UI of new feature',
            url: '',
            attributes: [
              {
                label: 'description',
                old: '',
                new: 'Design the UI of the new feature on figma',
              },
              {
                label: 'assignee',
                old: '',
                new: 'Asghar Mirzaei',
              },
              {
                label: 'due_on',
                old: '',
                new: '2025-05-08',
              },
            ],
          },
          {
            gid: '2',
            name: 'Implement the front-end of the new feature',
            url: '',
            attributes: [
              {
                label: 'description',
                old: '',
                new: 'Implement the front-end side of the new feature',
              },
              {
                label: 'assignee',
                old: '',
                new: 'Asghar Mirzaei',
              },
              {
                label: 'due_on',
                old: '',
                new: '2025-05-08',
              },
            ],
          },
          {
            gid: '3',
            name: 'Implement the back-end of the new feature',
            url: '',
            attributes: [
              {
                label: 'description',
                old: '',
                new: 'Implement the back-end side of the new feature',
              },
              {
                label: 'assignee',
                old: '',
                new: 'Asghar Mirzaei',
              },
              {
                label: 'due_on',
                old: '',
                new: '2025-05-08',
              },
            ],
          },
        ],
      },
      id: '8',
    },
  },
  {
    event: 'end',
    data: {},
  },
];
