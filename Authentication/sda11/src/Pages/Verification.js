import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Button, Paper, Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import { baseURL } from "../Url";

import { createSession, getUserPool } from '../Services/UserPool';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Verification = (props) => {
    const navigate = useNavigate()

    const [question, setQuestion] = useState({
        type: "Q1",
        question: "What is your first school name?"
    });
    const [questions,] = useState([
        {
            type: "Q1",
            question: "What is your first school name?"
        },
        {
            type: "Q2",
            question: "In which city were you born?"
        },
        {
            type: "Q3",
            question: "What is your favorite car?"
        }
    ]);
    const [formValues, setFormValues] = useState({
        answer1: {
            value: "",
            errorMessage: ""
        },
        answer2: {
            value: "",
            errorMessage: ""
        },
        answer3: {
            value: "",
            errorMessage: ""
        },
    })

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues({
            ...formValues,
            [name]: { ...formValues[name], value }
        })
    };
    // const [answer1, setAnswer1] = useState('');
    // const [answer2, setAnswer2] = useState('');
    // const [answer3, setAnswer3] = useState('');

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [answer, setAnswer] = useState('');

    const handleNameChange = (value) => {
        setAnswer(value)
        if (value === '') {
            setIsAnswerValid(false)
            return;
        }
        setIsAnswerValid(true)
    }

    const [isAnswerValid, setIsAnswerValid] = useState(true);
    const [isAnswer1Valid, setIsAnswer1Valid] = useState(true);
    const [isAnswer2Valid, setIsAnswer2Valid] = useState(true);
    const [isAnswer3Valid, setIsAnswer3Valid] = useState(true);
    const [isUserVerified, setIsUserVerified] = useState(false);

    const [isValidateForm, setIsValidateForm] = useState(false);

    useEffect(() => {
        async function getSession() {
            await createSession(localStorage.getItem('token'), localStorage.getItem('idToken'));
            const userPool = await getUserPool();
            const currentUser = await userPool.getCurrentUser();
            await currentUser.getSession(async (err, session) => {
                if (err) {
                    console.log(err);
                } else {
                    const payload = await session.getIdToken().decodePayload();
                    const email = await payload.email;
                    const name = await payload.name;
                    await setEmail(email);
                    localStorage.setItem('email', email);
                    // console.log(email);
                    await isUserRegistered(email);
                    localStorage.setItem('name', name);
                }
            })
        }
        getSession();
    }, [])

    const isUserRegistered = async (email) => {
        await fetch(baseURL + "checkUserStatus/" + email, {
            method: 'GET'
        })
            .then(response => response.json())
            .then(async data => {
                if (data.status === "success") {
                    if (data.userRegistered) {
                        console.log(questions[Math.floor(Math.random() * 3)]);
                        await setQuestion(questions[Math.floor(Math.random() * 3)])
                        await setIsUserVerified(true);
                        console.log(data);
                    } else {
                        await setIsUserVerified(false);
                        console.log(data);
                    }
                }
            })
            .catch((error) => {
                // setIsLoading(false);
                console.error('Error:', error);
            });
    }

    useEffect(() => {
        if (isValidateForm) {
            handleSubmit();
        }
    }, [isValidateForm]);

    const handleChangeWithValidate = (event) => {
        validate(event);

    };

    const validate = (event) => {
        event.preventDefault();
        let isValidate = true;

        const ALPHABET_REGEX = /^[a-zA-Z]+$/;


        let answer1ErrorMessage = formValues.answer1.value === "" ? "Answer is Mandatory" :
            ALPHABET_REGEX.test(formValues.answer1.value) ? "" : "Answer can contain only alphabets!"
        isValidate &= answer1ErrorMessage === "";

        setFormValues((formValues) => ({
            ...formValues,
            answer1: {
                value: formValues.answer1.value,
                errorMessage: answer1ErrorMessage,
            },
        }));


        let answer2ErrorMessage = formValues.answer2.value === "" ? "Answer is Mandatory" :
            ALPHABET_REGEX.test(formValues.answer2.value) ? "" : "Answer can contain only alphabets!"

        isValidate &= answer2ErrorMessage === "";

        setFormValues((formValues) => ({
            ...formValues,
            answer2: {
                value: formValues.answer2.value,
                errorMessage: answer2ErrorMessage,
            },
        }));

        let answer3ErrorMessage = formValues.answer3.value === "" ? "Answer is Mandatory" :
            ALPHABET_REGEX.test(formValues.answer3.value) ? "" : "Answer can contain only alphabets!"

        isValidate &= answer3ErrorMessage === "";

        setFormValues((formValues) => ({
            ...formValues,
            answer3: {
                value: formValues.answer3.value,
                errorMessage: answer3ErrorMessage,
            },
        }));

        setIsValidateForm(isValidate);
    };


    const handleSubmit = async () => {

        if (!isUserVerified) {
            await fetch(baseURL + "createQuestions&Answers", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                    "Q1": {
                        "question": "What is your first school name?",
                        "answer": formValues.answer1.value
                    },
                    "Q2": {
                        "question": "In which city were you born?",
                        "answer": formValues.answer2.value
                    },
                    "Q3": {
                        "question": "What is your favorite car?",
                        "answer": formValues.answer3.value
                    }
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        console.log(data);
                        localStorage.setItem('verified', 'true');
                        navigate('/');
                    } else {
                        alert(data.message);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
        else {
            await fetch(baseURL + "VerifyQuestions&Answers", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                    "question": question.type,
                    "answer": answer
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === "success") {
                        console.log(data);
                        localStorage.setItem('verified', 'true');
                        navigate('/');
                    } else {
                        alert(data.message);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }


    }

    return (
        <React.Fragment>
            <div style={{

                backgroundColor: "",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "150vh",
                width: "100vw",
                position: "fixed",
                top: 1,
                left: 0,
                zIndex: -1
            }}>
                <div>
                    {
                        isUserVerified ? <Paper

                            sx={{
                                flexGrow: 1,
                                maxWidth: '800px',
                                margin: '50px auto',
                                padding: '30px 50px',
                                textAlign: 'center',
                            }}

                        >
                            <Grid container spacing={3} justifyContent="flex-end" direction="column">
                                <Grid item xs={6} sm={6}>
                                    <Typography variant="h4" color="#2196F3" component="h4">
                                        Verification: Personal Questions
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        required
                                        id="answer"
                                        name="answer"
                                        label={question.question}
                                        type="text"
                                        sx={{ width: '100%' }}
                                        value={answer}
                                        onChange={(e) => handleNameChange(e.target.value)} 
                                        variant="outlined"
                                        fullWidth
                                        // error={
                                        //     formValues.answer1.errorMessage === ""
                                        //         ? false
                                        //         : true
                                        // }
                                        // helperText={formValues.answer1.errorMessage}
                                    />
                                </Grid>
                                <Grid item xs={4} sm={4} md={4}>
                                        <Button variant="contained" onClick={handleSubmit} >
                                            Verify
                                        </Button>
                                    </Grid>
                                </Grid>
                        </Paper> :
                            <Paper

                                sx={{
                                    flexGrow: 1,
                                    maxWidth: '800px',
                                    margin: '50px auto',
                                    padding: '30px 50px',
                                    textAlign: 'center',
                                }}

                            >
                                <Grid container spacing={3} justifyContent="flex-end" direction="column">
                                    <Grid item xs={6} sm={6}>
                                        <Typography variant="h4" color="#2196F3" component="h4">
                                            Verification: Personal Questions
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="answer1"
                                            name="answer1"
                                            label="What is your first school name?"
                                            type="text"
                                            sx={{ width: '100%' }}
                                            value={formValues.answer1.value}
                                            onChange={handleChange}
                                            variant="outlined"
                                            fullWidth
                                            error={
                                                formValues.answer1.errorMessage === ""
                                                    ? false
                                                    : true
                                            }
                                            helperText={formValues.answer1.errorMessage}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="answer2"
                                            name="answer2"
                                            label="In which city were you born?"
                                            type="text"
                                            sx={{ width: '100%' }}
                                            value={formValues.answer2.value}
                                            onChange={handleChange}
                                            variant="outlined"
                                            fullWidth
                                            error={
                                                formValues.answer2.errorMessage === ""
                                                    ? false
                                                    : true
                                            }
                                            helperText={formValues.answer2.errorMessage}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            id="answer3"
                                            name="answer3"
                                            label="What is your favorite car?"
                                            type="text"
                                            sx={{ width: '100%' }}
                                            value={formValues.answer3.value}
                                            onChange={handleChange}
                                            variant="outlined"
                                            fullWidth
                                            error={
                                                formValues.answer3.errorMessage === ""
                                                    ? false
                                                    : true
                                            }
                                            helperText={formValues.answer3.errorMessage}
                                        />
                                    </Grid>
                                    <Grid item xs={4} sm={4} md={4}>
                                        <Button variant="contained" onClick={handleChangeWithValidate} >
                                            Verify
                                        </Button>
                                    </Grid>
                                    <p>{formValues.answer1.value},{formValues.answer2.value},{formValues.answer3.value}
                                    </p>
                                    {/* <Grid item xs={4} sm={4} md={4}>
              {
                isValidateForm ?
                  <Typography variant="h6" component="h6" color={"green"}>
                    User Registered Successfully.
                  </Typography> : ""
              }
            </Grid> */}
                                </Grid>
                            </Paper>
                    }
                </div>

            </div>
        </React.Fragment>
    )
}
export default Verification;