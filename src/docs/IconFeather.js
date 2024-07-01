import React, { useEffect } from "react";
import Prism from "prismjs";
import { Col, Container, Row } from "react-bootstrap";
import Footer from "../layouts/Footer";
import HeaderMobile from "../layouts/HeaderMobile";
import feather from "feather-icons/dist/feather";

export default function IconFeather() {
  useEffect(() => {
    Prism.highlightAll();

    feather.replace();
  }, []);
  return (
    <React.Fragment>
      <HeaderMobile />
      <div className="main main-docs">
        <Container>
          <label className="main-title-label">Maps and Icons</label>
          <h2 className="main-title">Feathericons</h2>
          <p className="main-title-text">
            Feather is a collection of simply beautiful open source icons. Each
            icon is designed on a 24x24 grid with an emphasis on simplicity,
            consistency and usability.
          </p>

          <hr className="main-separator" />

          <div className="icon-group">
            <Row className="gx-1 gy-2">
              <Col>
                <i data-feather="activity"></i>
              </Col>
              <Col>
                <i data-feather="airplay"></i>
              </Col>
              <Col>
                <i data-feather="alert-circle"></i>
              </Col>
              <Col>
                <i data-feather="alert-octagon"></i>
              </Col>
              <Col>
                <i data-feather="alert-triangle"></i>
              </Col>
              <Col>
                <i data-feather="align-center"></i>
              </Col>
              <Col>
                <i data-feather="align-justify"></i>
              </Col>
              <Col>
                <i data-feather="align-left"></i>
              </Col>
              <Col>
                <i data-feather="align-right"></i>
              </Col>
              <Col>
                <i data-feather="anchor"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="aperture"></i>
              </Col>
              <Col>
                <i data-feather="archive"></i>
              </Col>
              <Col>
                <i data-feather="arrow-down-circle"></i>
              </Col>
              <Col>
                <i data-feather="arrow-down-left"></i>
              </Col>
              <Col>
                <i data-feather="arrow-down-right"></i>
              </Col>
              <Col>
                <i data-feather="arrow-down"></i>
              </Col>
              <Col>
                <i data-feather="arrow-left-circle"></i>
              </Col>
              <Col>
                <i data-feather="arrow-left"></i>
              </Col>
              <Col>
                <i data-feather="arrow-right-circle"></i>
              </Col>
              <Col>
                <i data-feather="arrow-right"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="arrow-up-circle"></i>
              </Col>
              <Col>
                <i data-feather="arrow-up-left"></i>
              </Col>
              <Col>
                <i data-feather="arrow-up-right"></i>
              </Col>
              <Col>
                <i data-feather="arrow-up"></i>
              </Col>
              <Col>
                <i data-feather="at-sign"></i>
              </Col>
              <Col>
                <i data-feather="award"></i>
              </Col>
              <Col>
                <i data-feather="bar-chart-2"></i>
              </Col>
              <Col>
                <i data-feather="bar-chart"></i>
              </Col>
              <Col>
                <i data-feather="battery-charging"></i>
              </Col>
              <Col>
                <i data-feather="battery"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="bell-off"></i>
              </Col>
              <Col>
                <i data-feather="bell"></i>
              </Col>
              <Col>
                <i data-feather="bluetooth"></i>
              </Col>
              <Col>
                <i data-feather="bold"></i>
              </Col>
              <Col>
                <i data-feather="book-open"></i>
              </Col>
              <Col>
                <i data-feather="book"></i>
              </Col>
              <Col>
                <i data-feather="bookmark"></i>
              </Col>
              <Col>
                <i data-feather="box"></i>
              </Col>
              <Col>
                <i data-feather="briefcase"></i>
              </Col>
              <Col>
                <i data-feather="calendar"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="camera-off"></i>
              </Col>
              <Col>
                <i data-feather="camera"></i>
              </Col>
              <Col>
                <i data-feather="cast"></i>
              </Col>
              <Col>
                <i data-feather="check-circle"></i>
              </Col>
              <Col>
                <i data-feather="check-square"></i>
              </Col>
              <Col>
                <i data-feather="check"></i>
              </Col>
              <Col>
                <i data-feather="chevron-down"></i>
              </Col>
              <Col>
                <i data-feather="chevron-left"></i>
              </Col>
              <Col>
                <i data-feather="chevron-right"></i>
              </Col>
              <Col>
                <i data-feather="chevron-up"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="chevrons-down"></i>
              </Col>
              <Col>
                <i data-feather="chevrons-left"></i>
              </Col>
              <Col>
                <i data-feather="chevrons-right"></i>
              </Col>
              <Col>
                <i data-feather="chevrons-up"></i>
              </Col>
              <Col>
                <i data-feather="chrome"></i>
              </Col>
              <Col>
                <i data-feather="circle"></i>
              </Col>
              <Col>
                <i data-feather="clipboard"></i>
              </Col>
              <Col>
                <i data-feather="cloud"></i>
              </Col>
              <Col>
                <i data-feather="cloud-drizzle"></i>
              </Col>
              <Col>
                <i data-feather="cloud-lightning"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="cloud-off"></i>
              </Col>
              <Col>
                <i data-feather="cloud-rain"></i>
              </Col>
              <Col>
                <i data-feather="cloud-snow"></i>
              </Col>
              <Col>
                <i data-feather="cloud"></i>
              </Col>
              <Col>
                <i data-feather="code"></i>
              </Col>
              <Col>
                <i data-feather="codepen"></i>
              </Col>
              <Col>
                <i data-feather="codesandbox"></i>
              </Col>
              <Col>
                <i data-feather="coffee"></i>
              </Col>
              <Col>
                <i data-feather="columns"></i>
              </Col>
              <Col>
                <i data-feather="command"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="compass"></i>
              </Col>
              <Col>
                <i data-feather="copy"></i>
              </Col>
              <Col>
                <i data-feather="corner-down-left"></i>
              </Col>
              <Col>
                <i data-feather="corner-down-right"></i>
              </Col>
              <Col>
                <i data-feather="corner-left-down"></i>
              </Col>
              <Col>
                <i data-feather="corner-left-up"></i>
              </Col>
              <Col>
                <i data-feather="corner-right-down"></i>
              </Col>
              <Col>
                <i data-feather="corner-right-up"></i>
              </Col>
              <Col>
                <i data-feather="corner-up-left"></i>
              </Col>
              <Col>
                <i data-feather="corner-up-right"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="cpu"></i>
              </Col>
              <Col>
                <i data-feather="credit-card"></i>
              </Col>
              <Col>
                <i data-feather="crop"></i>
              </Col>
              <Col>
                <i data-feather="crosshair"></i>
              </Col>
              <Col>
                <i data-feather="database"></i>
              </Col>
              <Col>
                <i data-feather="delete"></i>
              </Col>
              <Col>
                <i data-feather="disc"></i>
              </Col>
              <Col>
                <i data-feather="divide-circle"></i>
              </Col>
              <Col>
                <i data-feather="divide-square"></i>
              </Col>
              <Col>
                <i data-feather="divide"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="dollar-sign"></i>
              </Col>
              <Col>
                <i data-feather="download-cloud"></i>
              </Col>
              <Col>
                <i data-feather="download"></i>
              </Col>
              <Col>
                <i data-feather="dribbble"></i>
              </Col>
              <Col>
                <i data-feather="droplet"></i>
              </Col>
              <Col>
                <i data-feather="edit-2"></i>
              </Col>
              <Col>
                <i data-feather="edit-3"></i>
              </Col>
              <Col>
                <i data-feather="edit"></i>
              </Col>
              <Col>
                <i data-feather="external-link"></i>
              </Col>
              <Col>
                <i data-feather="eye-off"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="eye"></i>
              </Col>
              <Col>
                <i data-feather="facebook"></i>
              </Col>
              <Col>
                <i data-feather="fast-forward"></i>
              </Col>
              <Col>
                <i data-feather="feather"></i>
              </Col>
              <Col>
                <i data-feather="figma"></i>
              </Col>
              <Col>
                <i data-feather="file-minus"></i>
              </Col>
              <Col>
                <i data-feather="file-plus"></i>
              </Col>
              <Col>
                <i data-feather="file-text"></i>
              </Col>
              <Col>
                <i data-feather="file"></i>
              </Col>
              <Col>
                <i data-feather="film"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="filter"></i>
              </Col>
              <Col>
                <i data-feather="flag"></i>
              </Col>
              <Col>
                <i data-feather="folder-minus"></i>
              </Col>
              <Col>
                <i data-feather="folder-plus"></i>
              </Col>
              <Col>
                <i data-feather="folder"></i>
              </Col>
              <Col>
                <i data-feather="framer"></i>
              </Col>
              <Col>
                <i data-feather="frown"></i>
              </Col>
              <Col>
                <i data-feather="gift"></i>
              </Col>
              <Col>
                <i data-feather="git-branch"></i>
              </Col>
              <Col>
                <i data-feather="git-commit"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="git-merge"></i>
              </Col>
              <Col>
                <i data-feather="git-pull-request"></i>
              </Col>
              <Col>
                <i data-feather="github"></i>
              </Col>
              <Col>
                <i data-feather="gitlab"></i>
              </Col>
              <Col>
                <i data-feather="globe"></i>
              </Col>
              <Col>
                <i data-feather="grid"></i>
              </Col>
              <Col>
                <i data-feather="hard-drive"></i>
              </Col>
              <Col>
                <i data-feather="hash"></i>
              </Col>
              <Col>
                <i data-feather="headphones"></i>
              </Col>
              <Col>
                <i data-feather="heart"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="help-circle"></i>
              </Col>
              <Col>
                <i data-feather="hexagon"></i>
              </Col>
              <Col>
                <i data-feather="home"></i>
              </Col>
              <Col>
                <i data-feather="image"></i>
              </Col>
              <Col>
                <i data-feather="inbox"></i>
              </Col>
              <Col>
                <i data-feather="info"></i>
              </Col>
              <Col>
                <i data-feather="instagram"></i>
              </Col>
              <Col>
                <i data-feather="italic"></i>
              </Col>
              <Col>
                <i data-feather="key"></i>
              </Col>
              <Col>
                <i data-feather="layers"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="layout"></i>
              </Col>
              <Col>
                <i data-feather="life-buoy"></i>
              </Col>
              <Col>
                <i data-feather="link-2"></i>
              </Col>
              <Col>
                <i data-feather="link"></i>
              </Col>
              <Col>
                <i data-feather="linkedin"></i>
              </Col>
              <Col>
                <i data-feather="list"></i>
              </Col>
              <Col>
                <i data-feather="loader"></i>
              </Col>
              <Col>
                <i data-feather="lock"></i>
              </Col>
              <Col>
                <i data-feather="log-in"></i>
              </Col>
              <Col>
                <i data-feather="log-out"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="mail"></i>
              </Col>
              <Col>
                <i data-feather="map-pin"></i>
              </Col>
              <Col>
                <i data-feather="map"></i>
              </Col>
              <Col>
                <i data-feather="maximize-2"></i>
              </Col>
              <Col>
                <i data-feather="maximize"></i>
              </Col>
              <Col>
                <i data-feather="meh"></i>
              </Col>
              <Col>
                <i data-feather="menu"></i>
              </Col>
              <Col>
                <i data-feather="message-circle"></i>
              </Col>
              <Col>
                <i data-feather="message-square"></i>
              </Col>
              <Col>
                <i data-feather="mic-off"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="mic"></i>
              </Col>
              <Col>
                <i data-feather="minimize-2"></i>
              </Col>
              <Col>
                <i data-feather="minimize"></i>
              </Col>
              <Col>
                <i data-feather="minus-circle"></i>
              </Col>
              <Col>
                <i data-feather="minus-square"></i>
              </Col>
              <Col>
                <i data-feather="minus"></i>
              </Col>
              <Col>
                <i data-feather="monitor"></i>
              </Col>
              <Col>
                <i data-feather="moon"></i>
              </Col>
              <Col>
                <i data-feather="more-horizontal"></i>
              </Col>
              <Col>
                <i data-feather="more-vertical"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="mouse-pointer"></i>
              </Col>
              <Col>
                <i data-feather="move"></i>
              </Col>
              <Col>
                <i data-feather="music"></i>
              </Col>
              <Col>
                <i data-feather="navigation-2"></i>
              </Col>
              <Col>
                <i data-feather="navigation"></i>
              </Col>
              <Col>
                <i data-feather="octagon"></i>
              </Col>
              <Col>
                <i data-feather="package"></i>
              </Col>
              <Col>
                <i data-feather="paperclip"></i>
              </Col>
              <Col>
                <i data-feather="pause-circle"></i>
              </Col>
              <Col>
                <i data-feather="pause"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="pen-tool"></i>
              </Col>
              <Col>
                <i data-feather="percent"></i>
              </Col>
              <Col>
                <i data-feather="phone-call"></i>
              </Col>
              <Col>
                <i data-feather="phone-forwarded"></i>
              </Col>
              <Col>
                <i data-feather="phone-incoming"></i>
              </Col>
              <Col>
                <i data-feather="phone-missed"></i>
              </Col>
              <Col>
                <i data-feather="phone-off"></i>
              </Col>
              <Col>
                <i data-feather="phone-outgoing"></i>
              </Col>
              <Col>
                <i data-feather="phone"></i>
              </Col>
              <Col>
                <i data-feather="pie-chart"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="play-circle"></i>
              </Col>
              <Col>
                <i data-feather="play"></i>
              </Col>
              <Col>
                <i data-feather="plus-circle"></i>
              </Col>
              <Col>
                <i data-feather="plus-square"></i>
              </Col>
              <Col>
                <i data-feather="plus"></i>
              </Col>
              <Col>
                <i data-feather="pocket"></i>
              </Col>
              <Col>
                <i data-feather="power"></i>
              </Col>
              <Col>
                <i data-feather="printer"></i>
              </Col>
              <Col>
                <i data-feather="radio"></i>
              </Col>
              <Col>
                <i data-feather="refresh-ccw"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="refresh-cw"></i>
              </Col>
              <Col>
                <i data-feather="repeat"></i>
              </Col>
              <Col>
                <i data-feather="rewind"></i>
              </Col>
              <Col>
                <i data-feather="rotate-ccw"></i>
              </Col>
              <Col>
                <i data-feather="rotate-cw"></i>
              </Col>
              <Col>
                <i data-feather="rss"></i>
              </Col>
              <Col>
                <i data-feather="save"></i>
              </Col>
              <Col>
                <i data-feather="scissors"></i>
              </Col>
              <Col>
                <i data-feather="search"></i>
              </Col>
              <Col>
                <i data-feather="send"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="server"></i>
              </Col>
              <Col>
                <i data-feather="settings"></i>
              </Col>
              <Col>
                <i data-feather="share-2"></i>
              </Col>
              <Col>
                <i data-feather="share"></i>
              </Col>
              <Col>
                <i data-feather="shield-off"></i>
              </Col>
              <Col>
                <i data-feather="shield"></i>
              </Col>
              <Col>
                <i data-feather="shopping-bag"></i>
              </Col>
              <Col>
                <i data-feather="shopping-cart"></i>
              </Col>
              <Col>
                <i data-feather="shuffle"></i>
              </Col>
              <Col>
                <i data-feather="sidebar"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="skip-back"></i>
              </Col>
              <Col>
                <i data-feather="skip-forward"></i>
              </Col>
              <Col>
                <i data-feather="slack"></i>
              </Col>
              <Col>
                <i data-feather="slash"></i>
              </Col>
              <Col>
                <i data-feather="sliders"></i>
              </Col>
              <Col>
                <i data-feather="smartphone"></i>
              </Col>
              <Col>
                <i data-feather="smile"></i>
              </Col>
              <Col>
                <i data-feather="speaker"></i>
              </Col>
              <Col>
                <i data-feather="square"></i>
              </Col>
              <Col>
                <i data-feather="star"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="stop-circle"></i>
              </Col>
              <Col>
                <i data-feather="sun"></i>
              </Col>
              <Col>
                <i data-feather="sunrise"></i>
              </Col>
              <Col>
                <i data-feather="sunset"></i>
              </Col>
              <Col>
                <i data-feather="table"></i>
              </Col>
              <Col>
                <i data-feather="tablet"></i>
              </Col>
              <Col>
                <i data-feather="tag"></i>
              </Col>
              <Col>
                <i data-feather="target"></i>
              </Col>
              <Col>
                <i data-feather="terminal"></i>
              </Col>
              <Col>
                <i data-feather="thermometer"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="thumbs-down"></i>
              </Col>
              <Col>
                <i data-feather="thumbs-up"></i>
              </Col>
              <Col>
                <i data-feather="toggle-left"></i>
              </Col>
              <Col>
                <i data-feather="toggle-right"></i>
              </Col>
              <Col>
                <i data-feather="tool"></i>
              </Col>
              <Col>
                <i data-feather="trash-2"></i>
              </Col>
              <Col>
                <i data-feather="trash"></i>
              </Col>
              <Col>
                <i data-feather="trello"></i>
              </Col>
              <Col>
                <i data-feather="trending-down"></i>
              </Col>
              <Col>
                <i data-feather="trending-up"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="triangle"></i>
              </Col>
              <Col>
                <i data-feather="truck"></i>
              </Col>
              <Col>
                <i data-feather="tv"></i>
              </Col>
              <Col>
                <i data-feather="twitch"></i>
              </Col>
              <Col>
                <i data-feather="twitter"></i>
              </Col>
              <Col>
                <i data-feather="type"></i>
              </Col>
              <Col>
                <i data-feather="umbrella"></i>
              </Col>
              <Col>
                <i data-feather="underline"></i>
              </Col>
              <Col>
                <i data-feather="unlock"></i>
              </Col>
              <Col>
                <i data-feather="upload-cloud"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="upload"></i>
              </Col>
              <Col>
                <i data-feather="user-check"></i>
              </Col>
              <Col>
                <i data-feather="user-minus"></i>
              </Col>
              <Col>
                <i data-feather="user-plus"></i>
              </Col>
              <Col>
                <i data-feather="user-x"></i>
              </Col>
              <Col>
                <i data-feather="user"></i>
              </Col>
              <Col>
                <i data-feather="users"></i>
              </Col>
              <Col>
                <i data-feather="video-off"></i>
              </Col>
              <Col>
                <i data-feather="video"></i>
              </Col>
              <Col>
                <i data-feather="voicemail"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="volume-1"></i>
              </Col>
              <Col>
                <i data-feather="volume-2"></i>
              </Col>
              <Col>
                <i data-feather="volume-x"></i>
              </Col>
              <Col>
                <i data-feather="volume"></i>
              </Col>
              <Col>
                <i data-feather="watch"></i>
              </Col>
              <Col>
                <i data-feather="wifi-off"></i>
              </Col>
              <Col>
                <i data-feather="wifi"></i>
              </Col>
              <Col>
                <i data-feather="wind"></i>
              </Col>
              <Col>
                <i data-feather="x-circle"></i>
              </Col>
              <Col>
                <i data-feather="x-octagon"></i>
              </Col>
              <div className="w-100"></div>
              <Col>
                <i data-feather="x-square"></i>
              </Col>
              <Col>
                <i data-feather="x"></i>
              </Col>
              <Col>
                <i data-feather="youtube"></i>
              </Col>
              <Col>
                <i data-feather="zap-off"></i>
              </Col>
              <Col>
                <i data-feather="zap"></i>
              </Col>
              <Col>
                <i data-feather="zoom-in"></i>
              </Col>
              <Col>
                <i data-feather="zoom-out"></i>
              </Col>
              <Col></Col>
              <Col></Col>
              <Col></Col>
            </Row>
          </div>
        </Container>
      </div>
      <Footer />
    </React.Fragment>
  );
}
