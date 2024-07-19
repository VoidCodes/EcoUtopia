import axios from 'axios'
import { 
    Container,
    Text,
    Button,
    LoadingOverlay,
    Title,
    Box,
    ActionIcon,
    TextInput,
    rem,
    Textarea,
    NumberInput,
    Anchor,
    Notification,
    Select,
    Group,
} from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import { DateTimePicker, TimeInput } from '@mantine/dates';

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from 'react-router-dom';

function EditCourse() {
    const { courseId } = useParams()
    const navigate = useNavigate()
    const [course, setCourse] = useState(null)
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [formErrors, setFormErrors] = useState({});
    const [formData, setFormData] = useState({
        course_name: '',
        course_description: '',
        course_price: '',
        course_instructor: '',
        course_type: '',
        course_date: '',
        course_start_time: '',
        course_end_time: '',
        course_capacity: ''
      });

    const ref = useRef(null);

    const pickerControl = (
        <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );

    const validateForm = () => {
        const errors = {};
        if (!formData.course_name) errors.course_name = "Course name is required";
        if (!formData.course_description) errors.course_description = "Course description is required";
        if (!formData.course_price) errors.course_price = "Course price is required";
        if (!formData.course_instructor) errors.course_instructor = "Course instructor is required";
        if (!formData.course_type) errors.course_type = "Course type is required";
        if (!formData.course_date) errors.course_date = "Course date is required";
        if (!formData.course_start_time) errors.course_start_time = "Course start time is required";
        if (!formData.course_end_time) errors.course_end_time = "Course end time is required";
        return errors;
    };
    const handleSubmit = async () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            //console.log(values);
            const formattedData = {
                ...formData,
                course_date: new Date(formData.course_date).toISOString(),
                course_start_time: formData.course_start_time,
                course_end_time: formData.course_end_time,
            };
            console.log(`Formatted data: ${JSON.stringify(formattedData)}`);
            const response = await axios.put(`http://localhost:3001/courses/updateCourse/${courseId}`, formattedData);
            console.log(response.data);
            setSuccess(true);
            setError(false)
            setFormErrors({});
            setTimeout(() => {
                navigate('/admin/view-courses')
            }, 2000);
        } catch (error) {
            console.error('Error:', JSON.stringify(error));
            setError(true)
            if (error.response) {
                const responseErrors = error.response.data.errors || {};
                setFormErrors(responseErrors);
                setErrorMessage(JSON.stringify(error.response.data));
            } else if (error.request) {
                setErrorMessage('Error: No response received from the server.');
                setError(true)
            } else {
                setErrorMessage(`Error: ${error.message}`);
                setError(true)
            }
        }
    }

    useEffect(() => {
        document.title = 'Course Details - EcoUtopia'
        const fetchCourse = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/courses/getCourse/${courseId}`)
                const fetchedCourse = response.data
                setCourse(fetchedCourse)
                setFormData({
                    course_name: fetchedCourse.course_name,
                    course_description: fetchedCourse.course_description,
                    course_price: fetchedCourse.course_price,
                    course_instructor: fetchedCourse.course_instructor,
                    course_type: fetchedCourse.course_type,
                    course_date: fetchedCourse.course_date,
                    course_start_time: fetchedCourse.course_start_time,
                    course_end_time: fetchedCourse.course_end_time,
                    course_capacity: fetchedCourse.course_capacity
                })
                setLoading(false)
            } catch (error) {
                setError(error)
                setErrorMessage(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchCourse()
    }, [courseId])

    if (loading) {
        return (
            <Container size="xl">
                <LoadingOverlay visible />
            </Container>
        )
    }

    if (error) {
        return (
            <Container size="xl">
                <Text c={'red'} align="center" size="xl" style={{ marginTop: 20 }}>
                    {error.message} 
                </Text>
            </Container>
        )
    }

    return (
        <Container size="xl">
            <Box style={{ marginTop: 40 }} />
            <Title order={1} style={{ marginBottom: 20 }}>Edit Course</Title>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }}>
                <Box>
                    <TextInput
                        label="Course Name"
                        placeholder="Enter course name"
                        value={formData.course_name}
                        style={{ marginBottom: rem(1) }}
                        onChange={(event) => setFormData({ ...formData, course_name: event.target.value })}
                        required
                        error={formErrors.course_name}
                    />
                    <Textarea
                        label="Course Description"
                        placeholder="Enter course description"
                        value={formData.course_description}
                        style={{ marginBottom: rem(1) }}
                        onChange={(event) => setFormData({ ...formData, course_description: event.target.value })}
                        required
                        error={formErrors.course_description}
                    />
                    <TextInput
                        label="Course Instructor"
                        placeholder="Enter course instructor"
                        value={formData.course_instructor}
                        style={{ marginBottom: rem(1) }}
                        onChange={(event) => setFormData({ ...formData, course_instructor: event.target.value })}
                        required
                        error={formErrors.course_instructor}
                    />
                    <NumberInput
                        label="Course Price"
                        placeholder="Enter course price"
                        value={formData.course_price}
                        style={{ marginBottom: rem(1) }}
                        onChange={(value) => setFormData({ ...formData, course_price: value })}
                        required
                        error={formErrors.course_price}
                    />
                    <Select
                        label="Course Type"
                        placeholder="Select course type"
                        data={[
                            { value: 'Online', label: 'Online' },
                            { value: 'Physical', label: 'Physical' },
                        ]}
                        value={formData.course_type}
                        style={{ marginBottom: rem(1) }}
                        onChange={(value) => setFormData({ ...formData, course_type: value })}
                        required
                        error={formErrors.course_type}
                    />
                    <DateTimePicker 
                        label="Pick date and time" 
                        placeholder="Pick date and time" 
                        valueFormat='YYYY-MM-DD HH:mm:ss'
                        value={new Date(formData.course_date)}
                        onChange={(date) => setFormData({ ...formData, course_date: date.toISOString() })}
                        style={{ marginBottom: rem(1) }}
                        required
                        error={formErrors.course_date}
                    />
                    <TimeInput
                        label="Start Time"
                        placeholder="Enter start time"
                        rightSection={pickerControl}
                        ref={ref}
                        value={formData.course_start_time}
                        style={{ marginBottom: rem(1) }}
                        onChange={(time) => setFormData({ ...formData, course_start_time: time })}
                        required
                        error={formErrors.course_start_time}
                    />
                    <TimeInput
                        label="End Time"
                        placeholder="Enter end time"
                        rightSection={pickerControl}
                        ref={ref}
                        value={formData.course_end_time}
                        style={{ marginBottom: rem(1) }}
                        onChange={(time) => setFormData({ ...formData, course_end_time: time })}
                        required
                        error={formErrors.course_end_time}
                    />
                    <NumberInput
                        label="Capacity"
                        placeholder="Enter capacity"
                        value={formData.course_capacity}
                        style={{ marginBottom: rem(1) }}
                        onChange={(value) => setFormData({ ...formData, course_capacity: value })}
                        required
                        error={formErrors.course_capacity}
                    />
                    <Box style={{ marginTop: 20 }} />
                    <Group position="right" style={{ marginTop: 20 }}>
                        <Button
                            color="teal"
                            variant="dark"
                            style={{ marginBottom: rem(1) }}
                            onClick={() => {
                                handleSubmit(formData)
                                console.log(formData)
                            }}
                            type='submit'
                        >
                            Update Course
                        </Button>
                        <Anchor href="/admin/view-courses" style={{ marginLeft: rem(1) }}>
                            <Button variant="transparent" color="gray">
                                Cancel
                            </Button>
                        </Anchor>
                    </Group>
                </Box>
            </form>
            {success && (
                <Notification onClose={() => setSuccess(false)} color="green">
                    Course updated successfully!
                </Notification>
            )}
            {error && (
                <Notification onClose={() => setError(false)} color="red">
                    {errorMessage}
                </Notification>
            )}
        </Container>
    )
}

export default EditCourse