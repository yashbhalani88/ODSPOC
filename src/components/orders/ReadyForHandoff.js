import React from "react";

const ReadyForHandoff = ({orders}) => {

    return <>
        <div className="tvsr-kiosk-ui__info-text">Ready for pickup</div>
        <div className="tvsr-kiosk-ui__ready-order-container">
            {orders.map((order) => <div
                className={'tvsr-kiosk-ui__ready-order-container--order-number'} key={order.customerOrderNumber}>{order.ticketNumber}</div>)}
        </div>
    </>;
};

export default ReadyForHandoff;