import React, { useState } from "react";
import Cards from "../Cards";
import "../DateSelector/SelectorDate.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import DatePicker from "react-modern-calendar-datepicker";

const SelectorDate = () => {
    const [selectedDay1, setSelectedDay1] = useState(null);
    const [selectedDay2, setSelectedDay2] = useState(null);

    return (
        <>
            <div className="date-Selector">
                <div className="position-relative clearfix">
                    <div className="dash_date_pickr" onclick="show();">
                        <div className="dash_date_icon"></div>
                        <i className="fa-solid fa-clock"></i>
                        <span className="ms-1">Any Date</span>
                        <div className="dash_date_arrow"></div>
                    </div>
                    <div className="dash_date_inner">
                        <div className="clearfix" style={{ height: "70px" }}>
                            <div className="dash_date_from">
                                <label>From</label>
                                <div className="dash_input">
                                    <span className="date_icon2"></span>
                                    <DatePicker
                                        value={selectedDay1}
                                        onChange={setSelectedDay1}
                                        // renderInput={renderCustomInput} // render a custom input
                                        shouldHighlightWeekends
                                    />
                                </div>
                            </div>

                            <div className="dash_date_to">
                                <label>To</label>
                                <div className="dash_input">
                                    <span className="date_icon2"></span>
                                    <DatePicker
                                        value={selectedDay2}
                                        onChange={setSelectedDay2}
                                        // renderInput={renderCustomInput} // render a custom input
                                        shouldHighlightWeekends
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="date_btns">
                            <button id="today_btn" type="button" className="date_btn" OnClick="searchcount('1');">
                                {" "}
                                Today{" "}
                            </button>
                            <button id="yesterday_btn" type="button" className="date_btn" OnClick="searchcount('2');">
                                {" "}
                                Yesterday{" "}
                            </button>
                            <button id="this_month_btn" type="button" className="date_btn" onclick="searchcount(3);">
                                {" "}
                                This Month{" "}
                            </button>
                            <button id="past_month_btn" type="button" className="date_btn" onclick="searchcount(4);">
                                {" "}
                                Past Month{" "}
                            </button>
                            <button id="three_months_btn" type="button" className="date_btn" onclick="searchcount(5);">
                                {" "}
                                Past 3 Months{" "}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Cards />
        </>
    );
};

export default SelectorDate;
