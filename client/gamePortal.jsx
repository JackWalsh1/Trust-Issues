const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

let trustFundClaimTime;

const checkIfNewDay = () => {
    return Date.now() - trustFundClaimTime - 86400000 >= 0;
}

const handleTrustFund = (e) => {
    e.preventDefault();
    helper.hideError();
    helper.sendPost(e.target.action);

    return false;
}

const handleTrustMe = (e) => {
    e.preventDefault();
    helper.hideError();

    const trustSubmitted = document.querySelector("#trustSubmitted");

    if (!trustSubmitted || trustSubmitted < 2) {
        helper.handleError('Submit a trust value that is at least 2.');
        return false;
    }

    helper.sendPost(e.target.action, {trustSubmitted});

    return false;
}

const handleTrustUs = (e) => {
    e.preventDefault();
    helper.hideError();
    helper.sendPost(e.target.action);

    return false;
}

const handleSecretCode = (e) => {
    e.preventDefault();
    helper.hideError();

    const secretCode = document.querySelector("#secretCode");

    if (!secretCode) {
        helper.handleError('Submit a trust value..');
        return false;
    }

    helper.sendPost(e.target.action);

    return false;
}

const TrustMe = (props) => {
    return (
        <form id="trustMe"
            name="trustMeForm"
            onSubmit={handleTrustMe}
            action="/trustMe"
            method="POST"
            className="mainForm"
        >
            <label htmlFor='trustSubmitted'>Trust Submitted: </label>
            <input id='trustSubmitted' type='number' name='Trust Submission' placeholder='2'/>
            <input className='formSubmit' type='submit' value='Start Game'/>
        </form>
    )
}

const TrustUs = (props) => {
    return (
        <form id="trustUs"
            name="trustUsForm"
            onSubmit={handleTrustUs}
            action="/trustUs"
            method="GET"
            className="mainForm"
        >
            <input className='formSubmit' type='submit' value='Enter Current Game'/>
        </form>
    )
}

const TrustFund = (props) => {
    return (
        <form id="trustFund"
            name="trustFundForm"
            onSubmit={handleTrustFund}
            action="/claimTrustFund"
            method="POST"
            className="mainForm"
        >
            <input className='formSubmit' id='trustFundButton' type='submit'
            disabled= {props.clickable}
            value= {props.clickable ? 'Daily Trust Fund Claimed':
             'Claim Daily Trust Fund'}/>
        </form>
    )
}

const SecretCodes = (props) => {
    return (
        <form id="secretCodeForm"
            name="secretCodeForm"
            onSubmit={handleSecretCode}
            action="/makeAccountPremium"
            method="POST"
            className="mainForm"
        >
            <label htmlFor='trustSubmitted'>Secret Codes: </label>
            <input id='secretCode' type='password' name='secretCode' placeholder='you got any codes'/>
            <input className='formSubmit' type='submit' value='Submit Code'/>
        </form>
    )
}


const loadUserInfo = async () => {
    const response = await fetch(`/getUserInfo?page=gamePortal`);
    const data = await response.json();

    trustFundClaimTime = data.trustFundClaim;
    ReactDOM.render(
        <TrustFund clickable={checkIfNewDay()}/>,
        document.querySelector("#trustFund")
    );

    const trustFundButton = document.querySelector("#trustFundButton");
    trustFundButton.addEventListener('click', (e) => {
        e.preventDefault();
        trustFundButton.disabled = true;
        return false;
    });

    ReactDOM.render(
        <TrustMe /*this will use data*//>,
        document.querySelector("#trustMe")
    );

    return trustFundButton;
}

const checkTimeChange = async (trustFundButton) => {
    if (trustFundButton.disabled === true) {
        if (checkIfNewDay()) {
            trustFundButton.disabled = false;
        }
    }

    await helper.delay(1000);
    checkTimeChange(trustFundButton);
}

const init = () => {
    ReactDOM.render(
        <TrustUs />,
        document.querySelector("#trustUs")
    );
    ReactDOM.render(
        <SecretCodes />,
        document.querySelector("#secretCodes")
    );
    let trustFundButton = loadUserInfo();
    checkTimeChange(trustFundButton);
}

window.onload = init;


