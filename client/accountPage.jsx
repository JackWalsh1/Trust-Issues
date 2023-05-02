const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleDomo = (e) => {
    
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;

    if (!name || !age) {
        helper.handleError({ error: 'Both age / name are required!' });
    }

    helper.sendPost(e.target.action, {name, age}, loadDomosFromServer);

    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            name="domoForm"
            onSubmit={handleDomo}
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor='name'>Name: </label>
            <input id='domoName' type='text' name='name' placeholder='Domo Name'/>
            <label htmlFor='age'>Age: </label>
            <input id='domoAge' type='number' min='0' name='age'/>
            <input className='makeDomoSubmit' type='submit' value='Make Domo'/>
        </form>
    )
}

const ProfilePic = (props) => {
    return (
        <img className='profilePic'
        alt='profile pic'
        src='/assets/img/profilePic.png'></img>
    )
}

const Username = (props) => {
    return (
        <h2 className='username'>
        {props.username.length !== 0 ? props.username : "loading..."}
        </h2>
    )
}

const TrustValue = (props) => {
    return (
        <h2 className='trustValue'>
        Trust: {props.trustValue.length !== 0 ? props.trustValue : "loading..."}
        </h2>
    )
}

const Bio = (props) => {
    return (
        <p className='bio'>
        {props.bio}
        </p>
    )
}

const GameHistory = (props) => {
    if (props.games.length === 0) {
        return (
            <div className='gameHistory'>
                <h3 className='emptyGame'>No games yet!</h3>
            </div>
        );
    }

    const GameNodes = props.games.map(game => {
        return (
            <div key = {game._id} className='game'>
                <h3 className='gameNum'>Name: {game.num}</h3>
                <div className='personalHistory'> 
                <p>Claim: {game.claims[props.username].wasTrue}</p>
                <p>Profited?: {game.claims[props.username].profited}</p>
                </div>
            </div>
        )
    });

    return (
        <div className='gameHistory'>
            {GameNodes}
        </div>
    );
}



const loadUserInfo = async () => {
    const response = await fetch('/getUserInfo');
    const data = await response.json();

    console.log(data);
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.querySelector("#domos")
    );
}

const init = () => {
    loadUserInfo();
}

window.onload = init;


