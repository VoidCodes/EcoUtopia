import axios from "axios";
import { useState } from "react";
import {
  Container,
  Group,
  Button,
  TextInput,
  Box,
  Title,
  Avatar,
  Notification,
  FileInput,
  Progress,
} from "@mantine/core";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { IconPhoto } from "@tabler/icons-react";

function CreateReward() {
  const [rewardDescription, setRewardDescription] = useState("");
  const [rewardFilePreview, setRewardFilePreview] = useState(null);
  const [notification, setNotification] = useState({ message: "", color: "" });
  const [uploadProgress, setUploadProgress] = useState(0);

  const schema = yup.object().shape({
    rewardName: yup.string().required("Reward name is required"),
    rewardPoints: yup
      .number()
      .positive("Reward points must be greater than zero")
      .required("Reward points are required"),
    rewardExpiryDate: yup
      .date()
      .min(new Date(), "Expiry date cannot be in the past")
      .required("Expiry date is required"),
    rewardFile: yup.mixed().required("Reward file is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors: formErrors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const handleFileChange = (file) => {
    setRewardFilePreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("reward_name", data.rewardName);
    formData.append("reward_description", rewardDescription);
    formData.append("reward_points", data.rewardPoints);
    formData.append("reward_expiry_date", data.rewardExpiryDate.toISOString());
    formData.append("reward_file", data.rewardFile[0]);

    try {
      await axios.post("/rewards/createReward", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });
      setNotification({
        message: "Reward added successfully!",
        color: "green",
      });
    } catch (error) {
      setNotification({
        message: error.response?.data?.message || "Error adding reward",
        color: "red",
      });
    }
  };

  return (
    <Container size="sm">
      <Title order={2} mb="lg">
        Create Reward
      </Title>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Group direction="column" spacing="md">
          <Controller
            name="rewardName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder="Reward Name"
                error={formErrors.rewardName?.message}
                required
              />
            )}
          />
          <TextInput
            placeholder="Reward Description"
            value={rewardDescription}
            onChange={(e) => setRewardDescription(e.currentTarget.value)}
          />
          <Controller
            name="rewardPoints"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder="Reward Points"
                type="number"
                error={formErrors.rewardPoints?.message}
                required
              />
            )}
          />
          <Controller
            name="rewardExpiryDate"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextInput
                {...field}
                placeholder="Reward Expiry Date"
                type="date"
                error={formErrors.rewardExpiryDate?.message}
                required
              />
            )}
          />
          <Controller
            name="rewardFile"
            control={control}
            render={({ field }) => (
              <FileInput
                {...field}
                placeholder="Upload Reward File"
                onChange={(file) => {
                  field.onChange(file);
                  handleFileChange(file);
                }}
                required
                accept="image/*,application/pdf"
                error={formErrors.rewardFile?.message}
              />
            )}
          />
          {rewardFilePreview && (
            <Avatar src={rewardFilePreview} size={100} radius={50}>
              {!rewardFilePreview && <IconPhoto size={50} />}
            </Avatar>
          )}
          <Button type="submit" color="blue" disabled={!isValid}>
            Add Reward
          </Button>
        </Group>
      </form>
      {uploadProgress > 0 && <Progress value={uploadProgress} mt="md" />}
      {notification.message && (
        <Notification color={notification.color} mt="md">
          {notification.message}
        </Notification>
      )}
    </Container>
  );
}

export default CreateReward;
