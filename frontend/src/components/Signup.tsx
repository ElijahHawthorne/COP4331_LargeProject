import React, { useState } from 'react';

function Signup() {

    const [message, setMessage] = useState('');
    const [signupName, setSignupName] = React.useState('');
    const [signupPassword, setPassword] = React.useState('');

    async function doSignup(event: any): Promise<void> {
        event.preventDefault();
        var obj = { Signup: signupName, password: signupPassword };
        var js = JSON.stringify(obj);
        try {
            const response = await fetch('http://localhost:5000/api/signup',
                {
                    method: 'POST', body: js, headers: {
                        'Content-Type':
                            'application/json'
                    }
                });
            /*
            var res = JSON.parse(await response.text());
            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
            }
            else {
                var user =
                    { firstName: res.firstName, lastName: res.lastName, id: res.id }
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/cards';
            }
            */
        }
        catch (error: any) {
            alert(error.toString());
            return;
        }
    };

    function handleSetSignupName(e: any): void {
        setSignupName(e.target.value);
    }

    function handleSetPassword(e: any): void {
        setPassword(e.target.value);
    }

    return (
        <div id="SignupDiv">
            <span id="inner-title">Please Sign Up</span><br />
            <input type="text" id="signupName" placeholder="Username" /><br />
            <input type="password" id="signupPassword" placeholder="Password" /><br />
            <button type="submit" id="signupButton" className="buttons" onClick={doSignup}>
                Sign Up
            </button>
            <span id="SignupResult"></span>
        </div>
    );
};

export default Signup;
