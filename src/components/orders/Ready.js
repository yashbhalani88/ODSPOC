import React from "react";
import pickupdeli from "../../PickupDeli.svg"

const Ready = ({orders}) => {
    return <>
        <div className="tvsr-kiosk-ui__counter-service flex--column">
            <div className="tvsr-kiosk-ui__counter-service">
                <div className="tvsr-kiosk-ui__title">Counter service</div>
                <div className="tvsr-kiosk-ui__info-text serving">Now serving ticket</div>
            </div>
            {orders.length > 0 ?
                <div className="tvsr-kiosk-ui__serving-container tvsr-kiosk-ui__counter-service-column-left">
                    {orders.map((order) => <div
                        className={'tvsr-kiosk-ui__serving-number ' + (orders.length == 1 ? 'first-child' : '')} key={order.customerOrderNumber}>{order.ticketNumber}</div>)}
                </div> : <div className="tvsr-kiosk-ui__no-ready-ticket">
                    <img className="tvsr-kiosk-ui__no-ready-ticket--img"
                         src={pickupdeli}/>
                    <div className="tvsr-kiosk-ui__no-ready-ticket--info">Grab a ticket to be served next!</div>
                </div>}
        </div>
    </>;
};

export default Ready;