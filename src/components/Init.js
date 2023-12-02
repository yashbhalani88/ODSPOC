import React, {useEffect, useRef, useState} from 'react';
import InProgress from "./orders/InProgress";
import Ready from "./orders/Ready";
import ReadyForHandoff from "./orders/ReadyForHandoff";
import Nav from "./Nav";
import One111 from "../json/1111.json";
import One234 from "../json/1234.json";
import One322 from "../json/1322.json";
import One502 from "../json/1502.json";

/**
 * Makes an API call to the given endpoint with the given options.
 *
 * @param endpoint The endpoint to call.
 * @param options The options to pass to the fetch call.
 * @returns A promise that resolves to the response data.
 */
const makeAPICall = async (endpoint, options) => {
    const response = await fetch(endpoint, options);
    return await response.json();
};

const apiMode = true;

const stores = [
    { index: 1234, data: One234 },
    { index: 1322, data: One322 },
    { index: 1502, data: One502 },
    { index: 1111, data: One111 },
    { index: 1234, data: One234 },
    { index: 1322, data: One322 },
    { index: 1502, data: One502 },
];

/**
 * The Init component is the main component for the kiosk application. It renders the navigation bar, the order ready component, the order ready for handoff component, and the order in progress component.
 *
 * @returns React.JSX.Element rendered component.
 */
const Init = () => {
    const recurring = 5000; // The interval in milliseconds.
    const orders = useRef([]); // To store the list of orders.
    const intervalRef = useRef(); // To store the interval reference.

    const [isIntervalRunning, setIsIntervalRunning] = useState(false); // To track whether the interval is running.
    const [orderReady, setReady] = useState([]); // To store the list of orders that are ready.
    const [orderReadyForHandoff, setReadyForHandoff] = useState([]); // To store the list of orders that are ready for handoff.
    const [orderInProgress, setInProgress] = useState([]); // To store the list of orders that are in progress.
    const [currentStoreIndex, setCurrentStoreIndex] = useState(0); // To store the current store index.
    const [childData, setChildData] = useState({index: 1111, api: apiMode}); // To store the data from the child component.
    const [storeClosed, setStoreClosed] = useState(false); // To show store is closed and all process has been completed.

    let oTime = new Date();
    oTime.setSeconds(oTime.getSeconds() - 5); // Set the opening time to 5 seconds before the current time.

    let cTime = new Date();
    cTime.setSeconds(cTime.getSeconds() + 5); // Set the closing time to 5 seconds after the current time.

    const [currentDate, setCurrentDate] = useState(new Date());
    const [openTime, setOpenTime] = useState(oTime);
    const [closeTime, setCloseTime] = useState(cTime);

    /**
     * useEffect hook that updates the intervalRef hook based on the current date.
     *
     * If the current date is between the opening time and the closing time, the interval is started. Otherwise, the interval is cleared.
     */
    useEffect(() => {
        console.log('Times', {openTime, currentDate, closeTime})

        let oTime = new Date();
        oTime.setSeconds(oTime.getSeconds() - 5); // Set the opening time to 5 seconds before the current time.
    
        let cTime = new Date();
        cTime.setSeconds(cTime.getSeconds() + 5); // Set the closing time to 5 seconds after the current time.

        if (currentDate.getTime() >= openTime.getTime() && currentDate.getTime() < closeTime.getTime()) {
            console.log('operational mode')
        } else {
            console.log('clearInterval', closeTime)
            setCurrentStoreIndex(currentStoreIndex + 1)

            if (currentStoreIndex <= stores.length - 1) {
                setChildData({index: stores[currentStoreIndex].index, api: true})
            }

            if (currentStoreIndex > stores.length - 1) {
                setIsIntervalRunning(false);
                setStoreClosed(true)
            }
            clearInterval(intervalRef.current)
        }
    }, [currentDate]);

    /**
     * To update the orders hook and the orderReady, orderReadyForHandoff, and orderInProgress state hooks based on the childData hook.
     */
    useEffect(() => {
        setOpenTime(oTime)
        setCloseTime(cTime)

        if (isIntervalRunning) {
            clearInterval(intervalRef.current);
            setIsIntervalRunning(false);
        } else {
            intervalRef.current = setInterval(() => {
                orders.current = [];
                setReady([])
                setReadyForHandoff([])
                setInProgress([])
                setCurrentDate(new Date())

                let oTime = new Date();
                oTime.setSeconds(oTime.getSeconds() - 5);

                let cTime = new Date();
                cTime.setSeconds(cTime.getSeconds() + 5);

                // If the childData state variable contains an API = true, then make an API call to get the current orders, otherwise use static json data from local files
                if (childData.api) {
                    console.log('childData', childData);
                    const options = {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'authority': 'www-qa1.albertsons.com',
                            'user-agent': 'Mozilla/5.0 (SMART-TV; LINUX; Tizen 7.0) AppleWebKit/537.36 (KHTML, like Gecko) 94.0.4606.31/7.0 TV Safari/537.36',
                            'ocp-apim-subscription-key': '8ca6295a55f54368844b5982edc1cc01',
                            'sec-fetch-site': 'cross-site',
                            'sec-fetch-mode': 'cors',
                            "sec-fetch-dest": 'empty',
                            'accept-language': 'en-US',
                            'cookie': 'ApplicationGatewayAffinityCORS=baa0b16f559f6ca3a0fd2a3d81cc5358; ApplicationGatewayAffinity=baa0b16f559f6ca3a0fd2a3d81cc5358; visid_incap_1738018=CKLKT8hDRVihGPw/dCfq011nZmUAAAAAQUIPAAAAAAA50p8NAbI9xp2FIG7KUjmT; nlbi_1738018=xv50DGR8i3VxzFi2GkhmggAAAAB20Dnzb8xI5GGgLw0KzDM9; incap_ses_538_1738018=d0VpF0gnaUZJjA0JQF13B11nZmUAAAAAU91YwYyqUlR3qrCG3eFjVw=='
                        }
                    };
                                
                    makeAPICall("https://www-qa1.albertsons.com/abs/qapub/mock-playback/mockinator/playback/api/getTicketedOrderStatusQueue?siteId="+childData.index+"&deptId=27&startingTS=2023-10-10T15:39:05.026", options)
                        .then((data) => {
                            console.log('data', data)
                            orders.current = data.orders;

                            setReady(orders.current.filter(order => order.orderMode === "TICKET" && order.orderStatus === "Ready"))
                            setReadyForHandoff(orders.current.filter(order => order.orderStatus === "Ready_For_Handoff"))
                            setInProgress(orders.current.filter(order => order.orderStatus === "IN_PROGRESS"))
                        })
                        .catch((error) => {
                            console.log('error', error)
                        });
                } else {
                    switch (childData.index) {
                        case 0:
                            orders.current = One111;
                            break;
                        case 1:
                            orders.current = One234;
                            break;
                        case 2:
                            orders.current = One322;
                            break;
                        case 3:
                            orders.current = One502;
                            break;
                        default:
                            orders.current = [];
                    }

                    setReady(orders.current.filter(order => order.orderMode === "TICKET" && order.orderStatus === "Ready"))
                    setReadyForHandoff(orders.current.filter(order => order.orderStatus === "Ready_For_Handoff"))
                    setInProgress(orders.current.filter(order => order.orderStatus === "IN_PROGRESS"))
                }

            }, recurring)

            return () => clearInterval(intervalRef.current);
        }

    }, [childData]);

    return (<>
        {/* <Nav api={true} passChildData={setChildData}/> */}
        <div className="tvsr-kiosk-ui container">
            {
                storeClosed
                    ? (<div className="tvsr-kiosk-ui__store__closed">
                        <h1>Store is closed</h1>
                        <h2>Please come back later</h2>
                    </div>)
                    : <>
                        <Ready orders={orderReady} />
                        <div className="tvsr-kiosk-ui__order-ahead flex--column">
                            <div className="tvsr-kiosk-ui__title">
                                Order ahead <span className="tvsr-kiosk-ui__title--sub-title">(Mobile &amp; Kiosk)</span>
                            </div>
                            <ReadyForHandoff orders={orderReadyForHandoff} />
                            <InProgress orders={orderInProgress} />
                        </div>
                    </>
            }
        </div>
        {/* <Nav api={false} passChildData={setChildData}/> */}
    </>);
};

export default Init;