import React from "react";

const InProgress = ({orders}) => {

    return <>
        <div className="tvsr-kiosk-ui__info-text">Preparing</div>
        <div className="tvsr-kiosk-ui__preparing-order-container">
            {orders.map((order) => <div
                className={'tvsr-kiosk-ui__preparing-order-container--number'} key={order.customerOrderNumber}>{order.ticketNumber}</div>)}
        </div>
    </>;
};

export default InProgress;