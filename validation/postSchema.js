const yup = require('yup');

const postSchema = yup.object().shape({
    userId: yup.string().required(),
    userName: yup.string().required(),
    title: yup.string().required(),
    content: yup.string().required(),
    tags: yup.string().required(),  // Adjusted to expect a string
    image: yup.mixed(),
    residentId: yup.number().required(),
});

module.exports = postSchema;
