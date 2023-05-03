const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

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
    if (props.games.length === 1 && props.games[0] === 'No games yet!') {
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
                <p>Claim: {game.claim}</p>
                <p>Profited?: {game.profited}</p>
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
    const response = await fetch(`/getUserInfo?page=accountPage`);
    const data = await response.json();

    ReactDOM.render(
        <ProfilePic />,
        document.querySelector("#profilePic")
    );
    ReactDOM.render(
        <Username username={data.username} />,
        document.querySelector("#username")
    );
    ReactDOM.render(
        <TrustValue trustValue={data.trust} />,
        document.querySelector("#trustValue")
    );
    ReactDOM.render(
        <Bio bio={data.bio} />,
        document.querySelector("#bio")
    );
    ReactDOM.render(
        <GameHistory games={data.history} />,
        document.querySelector("#gameHistory")
    );
}

const init = () => {
    loadUserInfo();
}

window.onload = init;


