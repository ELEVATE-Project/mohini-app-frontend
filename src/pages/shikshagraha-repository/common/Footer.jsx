import React from "react";
import dandelion from "../../../assets/dandelion-footer.svg";
import dandelion1 from "../../../assets/dandelion-footer-1.svg";
import dandelion2 from "../../../assets/dandelion-footer-2.svg";
import dandelion3 from "../../../assets/dandelion-footer-3.svg";

const BASE_URL = "https://shikshagraha.org";
const JOIN_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfSX2bzdJzPBOlstfGg7vWqPFaS5weLnPpwIieR1DBdRgepPg/viewform";

const movementLinks = [
  { label: "Home", href: BASE_URL },
  { label: "About Us", href: `${BASE_URL}/about-us` },
  { label: "Impact", href: `${BASE_URL}/story-archive` },
  { label: "Samvaad", href: `${BASE_URL}/media-update/shiksha-samvaad-ignites-national-momentum-for-improving-indias-public-education-system` },
  { label: "Awards", href: `${BASE_URL}/awards` },
  { label: "Commons", href: `https://commons.shikshagraha.org/` },
  { label: "Media" , href: `${BASE_URL}/story-archive`},
];

const connectLinks = [
  { label: "Our Partners", href: `${BASE_URL}/#partners` },
  { label: "FAQs" },
  { label: "hello@shikshagraha.org", href: "mailto:hello@shikshagraha.org" },
];

const socialLinks = [
  {
    href: "https://www.instagram.com/shikshagraha/",
    img: "https://shikshagraha.org/wp-content/themes/twentytwentythree-child/images/Group-16.svg",
  },
  {
    href: "https://www.linkedin.com/company/shikshagraha/",
    img: "https://shikshagraha.org/wp-content/themes/twentytwentythree-child/images/Group-12.svg",
  },
  {
    href: "https://www.facebook.com/shikshagraha",
    img: "https://shikshagraha.org/wp-content/themes/twentytwentythree-child/images/Group-14.svg",
  },
  {
    href: "https://x.com/Shikshagraha",
    img: "https://shikshagraha.org/wp-content/themes/twentytwentythree-child/images/Image-39.png",
  },
  {
    href: "https://www.youtube.com/@shikshagraha",
    img: "https://shikshagraha.org/wp-content/uploads/2024/09/youtube-2.png",
  },
];

const CSS = `
.sg-footer {
  position: relative;
  overflow: hidden;
}

/* bottom wave image */
.sg-footer__bg1 {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}

/* small floating image */
.sg-footer__bg2 {
  
   position: absolute;
  top: 180px;
  right: 53%;
  width: 50px;
 
}
}

/* mid floating image */
.sg-footer__bg3 {
     position: absolute;
  top: 300px;
  right: 4%;
  width: 60px;
}

/* mid floating image */
.sg-footer__bg4 {
  position: absolute;
  top: 300px;
  right: 4%;
  width: 60px;
}
.sg-footer {
  background: #562f91;
  color: white;
  font-family: Montserrat, sans-serif;

  background-image: url('../../assets/dandelion-footer.svg');
  background-repeat: no-repeat;
  background-position: bottom center;
  background-size: cover;
   padding-bottom: 260px;
}

.sg-footer__main {
  display:flex;
  flex-wrap:wrap;
  padding:60px 10%;
  gap:100px;
}

/* DEFAULT = LARGE SCREEN (3 columns) */
.sg-footer__logo-col,
.sg-footer__right > div {
  flex: 1;
}

/* RIGHT SIDE */
.sg-footer__right {
  display:flex;
  flex:2;
  gap:40px;
}

/* LEFT */
.sg-footer__logo-row {
  display:flex;
  align-items:center;
  gap:10px;
  margin-bottom:12px;
}

.sg-footer__logo-icon {
  width:280px;
}

.sg-footer__tagline {
  font-size:16px;
  line-height:1.7;
  font-weight:600;
  width: 400px;
}

/* SOCIAL */
.sg-footer__socials {
  display:flex;
  gap:12px;
  margin-top:14px;
}

.sg-footer__social-link {
  width:36px;
  height:36px;
  border-radius:50%;
  border:1px solid rgba(255,255,255,.4);
  display:flex;
  align-items:center;
  justify-content:center;
}

/* NAV */
.sg-footer__nav-heading {
  font-size:16px;
  letter-spacing:2px;
  margin-bottom:18px;
  font-weight:700;
}

.sg-footer__nav-list {
  list-style:none;
  padding:0;
}

.sg-footer__nav-link {
  display:inline-flex;
  align-items:center;
  font-size:15px;
  color:rgba(255,255,255,.85);
  text-decoration:none;
  margin-bottom:12px;
  font-weight:600;
}

.sg-footer__nav-link::before {
  content:"-";
  color:#ff8a3d;
  margin-right:0;
  opacity:0;
  transform:translateX(-6px);
  transition:.25s;
}

.sg-footer__nav-link:hover::before {
  opacity:1;
  transform:translateX(0);
  margin-right:6px;
}

.sg-footer__nav-link:hover {
  color:white;
}

/* BUTTON */
.sg-footer__join-btn {
  display:inline-block;
  margin-top:10px;
  padding:12px 20px;
  background:#7f3289;
  border-radius:25px;
  text-decoration:none;
  color:white;
  width:fit-content;
  font-weight:600;
  font-size:20px;
}

.sg-footer__join-btn:hover {
  background:#fff;
  color:#7f3289;
  transform:translateY(-2px);
}

/* BOTTOM */
.sg-footer__bottom {
  border-top:1px solid rgba(255,255,255,.2);
  padding:20px 1%;
  display:flex;
  justify-content:space-between;
  font-size:14px;
  fontweight:600;
  margin: 0px 13%;
}

/* ---------- TABLET ---------- */
@media (max-width: 1024px) {

  .sg-footer__logo-col {
    flex: 0 0 100%;
  }

  .sg-footer__right {
    flex: 0 0 100%;
    justify-content:space-between;
  }

  .sg-footer__right > div {
    flex: 0 0 48%;
  }
    .sg-footer__tagline {
  font-size:16px;
  line-height:1.7;
  font-weight:600;
  width: 300px;
}
   .sg-footer {
   padding-bottom: 110px;
}
}

/* ---------- MOBILE ---------- */
@media (max-width: 600px) {

  .sg-footer__right {
    flex-direction:column;
  }

  .sg-footer__right > div {
    // flex: 0 0 100%;
  }
    
  .sg-footer__bottom {
  border-top:1px solid rgba(255,255,255,.2);
  padding:20px 2%;
  display:flex;
  flex-direction:column;
  gap:12px;
  justify-content:center;
  font-size:14px;
  fontweight:600;
   margin: 0px 4%;
 
}

.sg-footer__tagline {
  font-size:16px;
  line-height:1.7;
  font-weight:600;
  width: auto;
}

.sg-footer__main{
gap:40px;
padding:40px 6%;
}

  .sg-footer__bg2 {
    display: none;
  }

  /* mid floating image */
.sg-footer__bg3 {
         position: absolute;
    top: 613px;
    right: 35%;
    width: 50px;

}

  .sg-footer {
   padding-bottom: 100px;
}
}


`;

export default function Footer() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />


      <footer className="sg-footer">
        <img src={dandelion} className="sg-footer__bg1" alt="" />
        <img src={dandelion1} className="sg-footer__bg2" alt="" />
        <img src={dandelion2} className="sg-footer__bg3" alt="" />
        <img src={dandelion3} className="sg-footer__bg4" alt="" />


        <div className="sg-footer__main">

          {/* LEFT */}
          <div className="sg-footer__logo-col">
            <div className="sg-footer__logo-row">
              <img
                src="https://shikshagraha.org/wp-content/themes/twentytwentythree-child/images/Group-232-1.svg"
                className="sg-footer__logo-icon"
              />
            </div>

            <p className="sg-footer__tagline">
              Every step towards education. A people's movement to strengthen India's 1 million public schools so every child can learn well and be ready for the future.
            </p>

            <div className="sg-footer__socials">
              {socialLinks.map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sg-footer__social-link"
                  aria-label={`Visit ${s.href}`}
                >
                  <img
                    src={s.img}
                    alt="social icon"
                    className="sg-footer__social-icon"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="sg-footer__right">

            {/* MOVEMENT */}
            <div>
              <p className="sg-footer__nav-heading">MOVEMENT</p>
              <ul className="sg-footer__nav-list">
                {movementLinks.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="sg-footer__nav-link">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONNECT */}
            <div>
              <p className="sg-footer__nav-heading">CONNECT</p>
              <ul className="sg-footer__nav-list">
                {connectLinks.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="sg-footer__nav-link">
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={JOIN_URL} target="_blank" className="sg-footer__join-btn">
                    Join the Movement
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        <div className="sg-footer__bottom">
          <p>© 2026 Shikshagraha. All rights reserved.</p>
          <p>4th Floor, Sumo Sapphire, Outer Ring Road, KR Layout, J.P. Nagar, Bengaluru - 560 078.</p>
        </div>
      </footer>
    </>
  );
}