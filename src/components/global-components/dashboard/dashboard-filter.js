import React, { useEffect, useState } from "react";
import DashboardCards from "./dashboard-cards";
import DatePicker from "react-modern-calendar-datepicker";
import { 
    DASHBOARD_FILTER_VALUE, 
    DASHBOARD_FILTER_LABEL, 
    USER_TYPE 
} from "../../../constants";
import axios from "axios";
import AgentUpcomingAppointments from "../../agent-components/appointments/upcoming";
import CustomerUpcomingAppointments from "../../customer-components/appointments/upcoming";

import "./dashboard-filter.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";

export default function DashboardFilter(props) {
    const token = props?.type === USER_TYPE.AGENT ? JSON.parse(localStorage.getItem("agentToken")) : JSON.parse(localStorage.getItem("customerToken"));;
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedFilter, setSelectedFilter] = useState(DASHBOARD_FILTER_VALUE.CUSTOM);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [dashboardData, setDashboardData] = useState(null);

    const show = () => {
        setToggleMenu(!toggleMenu);
    }

    const selectedFilterHandler = (e) => {
        setSelectedFilter(e);
        if (e !== DASHBOARD_FILTER_VALUE.CUSTOM) {
            setStartDate("");
            setEndDate("");
        }
        setToggleMenu(false);
        loadDashboardData(e);
    }

    const loadDashboardData = async (filter) => {
        if (!filter) {
          return;
        }
    
        await axios.post(`${process.env.REACT_APP_API_URL}/${props.type === USER_TYPE.AGENT ? "agent" : "customer"}/dashboard`,
        {
            filter,
            startDate: startDate ? `${startDate.year}-${startDate.month}-${startDate.day}` : "",
            endDate: endDate ? `${endDate.year}-${endDate.month}-${endDate.day}` : "",
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }).then((response) => {
            console.log('dashboard-response', response);
            if (response?.data) {
                setDashboardData(response.data);
            }

            return true;
        }).catch(error => {
          console.log('dashboard-error', error);
        });
    };

    useEffect(() => {
        if (startDate && endDate) {
            setSelectedFilter(DASHBOARD_FILTER_VALUE.CUSTOM);
            loadDashboardData(DASHBOARD_FILTER_VALUE.CUSTOM);
            setToggleMenu(false);
        }
    }, [startDate, endDate]);

    return (
        <div>
            <div className="date-Selector">
                <div className="position-relative clearfix">
                    <div className="dash_date_pickr" onClick={show}>
                        <div className="dash_date_icon"></div>
                        <i className="fa-solid fa-clock"></i>
                        <span className="ms-1">{ DASHBOARD_FILTER_LABEL[selectedFilter] }</span>
                        <div className="dash_date_arrow"></div>
                    </div>
                    <div className={`dash_date_inner ${toggleMenu ? "show" : ""}`}>
                        <div className="clearfix" style={{ height: "70px" }}>
                            <div className="dash_date_from">
                                <label>From</label>
                                <div className="dash_input">
                                    <span className="date_icon2"></span>
                                    <DatePicker
                                        value={startDate}
                                        onChange={setStartDate}
                                        shouldHighlightWeekends
                                    />
                                </div>
                            </div>
                            <div className="dash_date_to">
                                <label>To</label>
                                <div className="dash_input">
                                    <span className="date_icon2"></span>
                                    <DatePicker
                                        value={endDate}
                                        onChange={setEndDate}
                                        shouldHighlightWeekends
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="date_btns">
                            <button type="button" className={`date_btn ${selectedFilter === DASHBOARD_FILTER_VALUE.TODAY ? "active" : ""}`} onClick={() => selectedFilterHandler(DASHBOARD_FILTER_VALUE.TODAY)}>
                                {" "}{DASHBOARD_FILTER_LABEL[DASHBOARD_FILTER_VALUE.TODAY]}{" "}
                            </button>
                            <button type="button" className={`date_btn ${selectedFilter === DASHBOARD_FILTER_VALUE.YESTERDAY ? "active" : ""}`} onClick={() => selectedFilterHandler(DASHBOARD_FILTER_VALUE.YESTERDAY)}>
                                {" "}{DASHBOARD_FILTER_LABEL[DASHBOARD_FILTER_VALUE.YESTERDAY]}{" "}
                            </button>
                            <button type="button" className={`date_btn ${selectedFilter === DASHBOARD_FILTER_VALUE.THIS_MONTH ? "active" : ""}`} onClick={() => selectedFilterHandler(DASHBOARD_FILTER_VALUE.THIS_MONTH)}>
                                {" "}{DASHBOARD_FILTER_LABEL[DASHBOARD_FILTER_VALUE.THIS_MONTH]}{" "}
                            </button>
                            <button type="button" className={`date_btn ${selectedFilter === DASHBOARD_FILTER_VALUE.PAST_MONTH ? "active" : ""}`} onClick={() => selectedFilterHandler(DASHBOARD_FILTER_VALUE.PAST_MONTH)}>
                                {" "}{DASHBOARD_FILTER_LABEL[DASHBOARD_FILTER_VALUE.PAST_MONTH]}{" "}
                            </button>
                            <button type="button" className={`date_btn ${selectedFilter === DASHBOARD_FILTER_VALUE.PAST_3_MONTH ? "active" : ""}`} onClick={() => selectedFilterHandler(DASHBOARD_FILTER_VALUE.PAST_3_MONTH)}>
                            {" "}{DASHBOARD_FILTER_LABEL[DASHBOARD_FILTER_VALUE.PAST_3_MONTH]}{" "}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <DashboardCards data={dashboardData} type={props.type}/>
            <div className="ltn__myaccount-tab-content-inner">
                <div className="ltn__my-properties-table table-responsive">
                <ul
                  className="nav nav-pills pb-2"
                  id="pills-tab"
                  role="tablist"
                  style={{ borderBottom: "1px solid #e5eaee", margin: "0 10px" }}
                >
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link active customColor"
                      id="pills-upcoming-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#pills-upcoming"
                      type="button"
                      role="tab"
                      aria-controls="pills-upcoming"
                      aria-selected="true"
                    >
                      Upcoming
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="pills-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="pills-upcoming"
                    role="tabpanel"
                    aria-labelledby="pills-upcoming-tab"
                  >
                    {
                        props.type === USER_TYPE.AGENT && (
                            <AgentUpcomingAppointments selectedFilter={selectedFilter} startDate={startDate} endDate={endDate}/>
                        )
                    }

                    {
                        props.type === USER_TYPE.CUSTOMER && (
                            <CustomerUpcomingAppointments selectedFilter={selectedFilter} startDate={startDate} endDate={endDate}/>
                        )
                    }
                  </div>
                </div>
              </div>
            </div>
        </div>
    );
};