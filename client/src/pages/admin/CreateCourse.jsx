import axios from 'axios'
import moment from 'moment'
import { 
    ActionIcon,
    Box, 
    TextInput,
    rem,
    Textarea,
    NumberInput,
    Button,
    Title,
    Container,
    Anchor,
    Notification,
} from '@mantine/core'
import { DateTimePicker, TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';
import { useState, useRef, useEffect } from 'react'
//import AdminNav from '../../components/AdminNav'

function CreateCourse() {
    const ref = useRef(null);

    const pickerControl = (
        <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
        <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
        </ActionIcon>
    );
    const [success, setSuccess] = useState(false);
    const [time, setTime] = useState(new Date());
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
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

    useEffect(() => {
        document.title = 'Create Course - EcoUtopia';
    }, []);

    const handleTimeChange = (value) => {
        const formattedTime = moment(value).format('HH:mm');
        setTime(formattedTime);
    };

    const handleSubmit = async (values) => {
        try {
            console.log(values);
            const response = await axios.post('http://localhost:3001/courses/createCourse', values);
            console.log(response.data);
            setSuccess(true);
            setError(false);
            setFormErrors({});
        } catch (error) {
            console.error('Error:', error);
            setError(true);
            if (error.response) {
                const responseErrors = error.response.data.errors || {};
                setFormErrors(responseErrors);
                setErrorMessage(JSON.stringify(error.response.data));
            } else if (error.request) {
                setErrorMessage('Error: No response received from the server.');
            } else {
                setErrorMessage(`Error: ${error.message}`);
            }
        }
    };
    return (
        <>
        {/*<AdminNav /> */}
        <Container>
            <Box mt="lg" p="lg" style={{maxWidth: "800px", margin: "auto"}}>
                <Title order={1}>Create Course</Title>
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(formData); }}>
                    <TextInput
                        label="Course Name"
                        placeholder="Enter course name"
                        required
                        value={formData.course_name}
                        onChange={(event) => setFormData({ ...formData, course_name: event.target.value })}
                    />
                    <Textarea
                        label="Course Description"
                        placeholder="Enter course description"
                        required
                        value={formData.course_description}
                        onChange={(event) => setFormData({ ...formData, course_description: event.target.value })}
                    />
                    <NumberInput
                        label="Course Price"
                        placeholder="Enter course price"
                        required
                        value={formData.course_price}
                        onChange={(value) => setFormData({ ...formData, course_price: value })}
                    />
                    <TextInput
                        label="Course Instructor"
                        placeholder="Enter course instructor"
                        required
                        value={formData.course_instructor}
                        onChange={(event) => setFormData({ ...formData, course_instructor: event.target.value })}
                    />
                    <TextInput
                        label="Course Type"
                        placeholder="Enter course type"
                        required
                        value={formData.course_type}
                        onChange={(event) => setFormData({ ...formData, course_type: event.target.value })}
                    />
                    <DateTimePicker
                        label="Course Date"
                        placeholder="Enter course date"
                        required
                        value={formData.course_date}
                        onChange={(value) => setFormData({ ...formData, course_date: value })}
                    />
                    <TimeInput
                        label="Start Time"
                        placeholder="Enter start time"
                        ref={ref}
                        rightSection={pickerControl}
                        required
                        value={formData.course_start_time}
                        onChange={(value) => setFormData({ ...formData, course_start_time: moment(value).format('HH:mm:ss') })}
                        //onChange={ (value) => handleTimeChange(value) }
                    />
                    <TimeInput
                        label="End Time"
                        placeholder="Enter end time"
                        ref={ref}
                        rightSection={pickerControl}
                        required
                        value={formData.course_end_time}
                        onChange={(value) => setFormData({ ...formData, course_end_time: moment(value).format('HH:mm:ss') })}
                        //onChange={(value) => handleTimeChange(value) }
                    />
                    <NumberInput
                        label="Capacity"
                        placeholder="Enter capacity"
                        required
                        value={formData.course_capacity}
                        onChange={(value) => setFormData({ ...formData, course_capacity: value })}
                    />
                    <Box mt="lg" />
                    <Button type="submit" variant="filled" color="blue">Create Course</Button>
                    <Anchor href="/admin/view-courses">
                        <Button variant="outline" color="gray" style={{marginLeft: "10px"}}>Cancel</Button>
                    </Anchor>
                    {success && (
                        <Notification onClose={() => setSuccess(false)} color="green">
                            Course created successfully
                        </Notification>
                    )}
                    {error && (
                        <Notification onClose={() => setError(false)} color="red">
                            {errorMessage}
                        </Notification>
                    )}
                </form>
            </Box>
        </Container>
        </>
    )
}

export default CreateCourse