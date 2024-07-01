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
  const [rewardDescription, setRewardDescription] = useState('');
  const [rewardPoints, setRewardPoints] = useState('');
  const [rewardExpiryDate, setRewardExpiryDate] = useState('');
  const [errors, setErrors] = useState({ rewardName: '', rewardPoints: '', rewardExpiryDate: '' });
  const [notification, setNotification] = useState({ message: '', color: '' });

  const validateInputs = () => {
    let valid = true;
    let errors = { rewardName: '', rewardPoints: '', rewardExpiryDate: '' };

    if (!rewardName) {
      errors.rewardName = 'Reward name is required';
      valid = false;
    }
    if (!rewardPoints || isNaN(rewardPoints) || rewardPoints <= 0) {
      errors.rewardPoints = 'Reward points must be a positive number';
      valid = false;
    }
    if (!rewardExpiryDate || new Date(rewardExpiryDate) < new Date()) {
      errors.rewardExpiryDate = 'Expiry date must be in the future';
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  const handleAddReward = () => {
    if (!validateInputs()) {
      setNotification({ message: 'Please fix the errors in the form', color: 'red' });
      return;
    }

    const newReward = {
      reward_id: rewards.length + 1,
      reward_name: rewardName,
      reward_description: rewardDescription,
      reward_points: rewardPoints,
      reward_expiry_date: rewardExpiryDate,
    };

    setRewards([...rewards, newReward]);
    setRewardName('');
    setRewardDescription('');
    setRewardPoints('');
    setRewardExpiryDate('');
    setNotification({ message: 'Reward added successfully!', color: 'green' });
  };

  return (
    <div>
      <h1>Admin Rewards</h1>
      <div>
        <input
          type="text"
          placeholder="Reward Name"
          value={rewardName}
          onChange={(e) => setRewardName(e.target.value)}
        />
        {errors.rewardName && <span>{errors.rewardName}</span>}
      </div>
      <div>
        <input
          type="text"
          placeholder="Reward Points"
          value={rewardPoints}
          onChange={(e) => setRewardPoints(e.target.value)}
        />
        {errors.rewardPoints && <span>{errors.rewardPoints}</span>}
      </div>
      <div>
        <input
          type="date"
          placeholder="Reward Expiry Date"
          value={rewardExpiryDate}
          onChange={(e) => setRewardExpiryDate(e.target.value)}
        />
        {errors.rewardExpiryDate && <span>{errors.rewardExpiryDate}</span>}
      </div>
      <button onClick={handleAddReward}>Add Reward</button>
      {notification.message && (
        <div style={{ color: notification.color }}>{notification.message}</div>
      )}
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
  );
}

export default CreateReward;
