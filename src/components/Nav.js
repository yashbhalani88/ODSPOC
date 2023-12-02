import React from "react";

const Nav = (props) => {
    const indexes = [1502, 1322, 1234, 1111];
    // console.log('props', props);
    return <div className="tvsr-kiosk-ui-viewing">
        <ul>
            {indexes.map((index) => <li key={props.api + '-' + index}>
                <a onClick={() => {
                    props.passChildData({'index': index, 'api': props.api})
                }}>{index}
                </a>
            </li>)}
        </ul>
    </div>;
};

export default Nav;