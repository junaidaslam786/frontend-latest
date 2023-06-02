import React from "react";
import DashboardFilter from "./dashboard-filter";
import { getUserDetailsFromJwt } from "../../../utils";
import { USER_TYPE } from "../../../constants";

export default function Dashboard({ type }) {
    const userDetail = getUserDetailsFromJwt();

    return (
        <React.Fragment>
            <div className="ltn__comment-area mb-50">
              <div className="ltn-author-introducing clearfix">
                <div className="author-img">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${userDetail.profileImage}`}
                    alt="Author"
                  />
                </div>
                <div className="author-info">
                  <h6>{type === USER_TYPE.CUSTOMER ? process.env.REACT_APP_CUSTOMER_ENTITY_LABEL : process.env.REACT_APP_AGENT_ENTITY_LABEL}</h6>
                  <h2>{userDetail.name}</h2>
                  <div className="footer-address">
                    <ul>
                      <li>
                        <div className="footer-address-icon">
                          <i className="icon-call" />
                        </div>
                        <div className="footer-address-info">
                          <p>
                            <a href={`tel:${userDetail.phoneNumber}`}>{userDetail.phoneNumber}</a>
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="footer-address-icon">
                          <i className="icon-mail" />
                        </div>
                        <div className="footer-address-info">
                          <p>
                            <a href={`mailto:${userDetail.email}`}>{userDetail.email}</a>
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <DashboardFilter type={type}/>
        </React.Fragment>
    );
}
