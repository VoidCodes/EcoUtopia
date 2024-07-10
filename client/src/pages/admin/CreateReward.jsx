import { useState } from 'react';
import dayjs from 'dayjs';

// Define orderslist and global.datetimeFormat as they are used but not defined
const orderslist = [
  {
    order_id: 1,
    course_id: 101,
    Course: { course_name: 'Course 101' },
    order_status: 'Completed',
    order_date: new Date(),
  },
  // Add more orders as needed
];

const global = {
  datetimeFormat: 'YYYY-MM-DD',
};

function CreateReward() {
  const [rewards, setRewards] = useState([]);
  const [rewardName, setRewardName] = useState('');
  const [rewardPoints, setRewardPoints] = useState('');
<div>
    <h1>Admin Rewards</h1>
    <table>
      <thead>
        <tr>
          <th>Reward ID</th>
          <th>Reward Name</th>
          <th>Reward Description</th>
          <th>Reward Points</th>
          <th>Reward Expiry Date</th>
        </tr>
      </thead>
      <tbody>
        {rewards.map((reward, i) => (
          <tr key={i}>
            <td>{reward.reward_id}</td>
            <td>{reward.reward_name}</td>
            <td>{reward.reward_description}</td>
            <td>{reward.reward_points}</td>
            <td>{dayjs(reward.reward_expiry_date).format(global.datetimeFormat)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  return (
    <div>
      <h1>Create Reward</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setRewards([
            ...rewards,
            {
              reward_id: rewards.length + 1,
              reward_name: rewardName,
              reward_description: 'Reward Description',
              reward_points: rewardPoints,
              reward_expiry_date: new Date(),
            },
          ]);
          setRewardName('');
          setRewardPoints('');
        }}
      >
        <label>
          Reward Name:
          <input
            type="text"
            value={rewardName}
            onChange={(event) => setRewardName(event.target.value)}
          />
        </label>
        <label>
          Reward Points:
          <input
            type="number"
            value={rewardPoints}
            onChange={(event) => setRewardPoints(event.target.value)}
          />
        </label>
        <button type="submit">Create Reward</button>
      </form>
    </div>
  )
}

export default CreateReward;