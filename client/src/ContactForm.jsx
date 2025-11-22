import React, { useState } from "react";
import "./ContactForm.css";
import bgImage from "./assets/photoCollage.png";

const ContactForm = () => {
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      number: formData.get("number"),
      date: formData.get("date"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatusMessage("Details sent successfully!");
        event.target.reset();
      } else {
        setStatusMessage("Failed to send details. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setStatusMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-logo">Pench National Park Safari</div>&nbsp;
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "brown",
            color: "white",
            padding: "10px 24px",
            borderRadius: "9999px",
            textDecoration: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            fontFamily: "sans-serif",
          }}
        >
          Phone Number - <strong>&nbsp;+91-9335276229</strong>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "brown",
            color: "white",
            padding: "10px 24px",
            borderRadius: "9999px",
            textDecoration: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            fontFamily: "sans-serif",
          }}
        >
          GoJunglee Adventures
        </div>
        <a
          href="https://wa.me/9335276229"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#25D366", // solid WhatsApp green
            color: "white",
            padding: "10px 24px",
            borderRadius: "9999px",
            textDecoration: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            fontFamily: "sans-serif",
          }}
        >
          <span style={{ fontSize: "12px", lineHeight: "14px" }}>
            Chat with us
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              style={{
                width: "20px",
                height: "20px",
                background: "white",
                borderRadius: "50%",
                padding: "2px",
              }}
            />
            <span style={{ fontWeight: "600", fontSize: "15px" }}>
              WhatsApp
            </span>
          </div>
          <span style={{ fontSize: "11px", opacity: 0.9 }}>Click Here </span>
        </a>
      </nav>
      <div
        className="form-container"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="intro-container">
          {/* Heading Box */}
          <section className="info-box heading-box">
            <h1>
              <strong>
                Plan your getaway Jungle safari, Resort and Taxi booking
              </strong>
            </h1>
            <p>
              As an experienced travel operator specializing in wildlife tours,
              we help you explore the majestic beauty of Pench National Park one
              of India's finest Tiger reserves. Whether you're seeking
              adventure, photography or a peaceful retreat in nature, we offer
              curated travel packages tailored to your needs.
            </p>
          </section>
          <section className="info-box overview-box">
            <h1>Let Us Plan your PENCH Jungle Safari</h1>
            <p>
              <strong>Monsoon Season:</strong> Buffer Zone available from{" "}
              <strong>01 July to 30 September.</strong>
            </p>
            <p>
              <strong>Booking:</strong> Core & Buffer Zone bookings accepted
              from <strong>01 October onwards.</strong>
            </p>
          </section>

          {/* Overview Box */}
          <section className="info-box overview-box">
            <p>
              The best way to ensure an amazing wildlife experience at{" "}
              <strong>Pench Tiger Reserve</strong> is to reserve before your
              visit. Online booking is available and recommended because entries
              per zone are limited. <strong>Prebooking is advised</strong> in
              peak season.
            </p>
            <p>
              <strong>Nearest Airport:</strong> Nagpur •{" "}
              <strong>Nearest Railway Station:</strong> Nagpur (Maharashtra),
              Seoni (Madhya Pradesh)
            </p>
          </section>

          {/* Zones Box */}
          <section className="info-box">
            <h2>Safari Zones</h2>
            <div className="two-col">
              <div>
                <h3>Madhya Pradesh</h3>
                <p>
                  <strong>Core Zones:</strong> Touria, Karmajhiri, Jhamtara
                </p>
                <p>
                  <strong>Buffer Zones:</strong> Khawasa, Khumbhpani, Masurnala,
                  Rukhad, Teliya
                </p>
              </div>
              <div>
                <h3>Maharashtra</h3>
                <p>
                  <strong>Core Zones:</strong> Sillari, Khursapar, Chorbahuli
                </p>
              </div>
            </div>
          </section>

          {/* Timings Box */}
          <section className="info-box">
            <h2>Safari Timing</h2>
            <p>
              <strong>Morning:</strong> 06:30 AM – 10:00 AM |{" "}
              <strong>Evening:</strong> 02:00 PM – 06:00 PM
            </p>
            <p className="muted">
              (Timings are tentative and may vary by season/gate.)
            </p>
          </section>

          {/* Night Safari Box */}
          <section className="info-box">
            <h2>Night Safari</h2>
            <p>
              Predators are more active after sunset. Night Safari runs from{" "}
              <strong>6:00 PM – 9:00 PM</strong> in the Rukhad & Khawasa buffer
              zones — a thrilling way to experience nocturnal wildlife.
            </p>
          </section>

          {/* Charges Box */}
          <section className="info-box">
            <h2>Safari Charges</h2>
            <ul className="charges-list">
              <li>
                <strong>Core Zone (MP):</strong> ₹8,500 (Mon–Fri) | ₹9,200
                (Sat–Sun)
              </li>
              <li>
                <strong>Core Zone (MH):</strong> ₹7,000 (All days)
              </li>
              <li>
                <strong>Buffer Zone (MP):</strong> ₹7,200 (All days)
              </li>
              <li>
                <strong>Night Safari (MP):</strong> ₹7,500 (All days)
              </li>
            </ul>
            <p className="muted">
              (All charges include entry fee, permit, guide, driver, gypsy &
              service charge.)
            </p>
            <p>
              <strong>Note:</strong> Pickup/drop from resort available at extra
              charge.
            </p>
          </section>

          {/* Additional Info Box */}
          <section className="info-box">
            <h2>Additional Information</h2>
            <ul>
              <li>
                Book at least <strong>120 days</strong> in advance — permits are
                limited.
              </li>
              <li>
                Carry valid ID (Driver's License, Passport, PAN, Voter ID) for
                booking.
              </li>
              <li>
                <em>
                  Safaris are non-cancellable, non-transferable and
                  non-refundable once issued.
                </em>
              </li>
              <li>Max 6 persons per jeep; children under 5 enter free.</li>
            </ul>
          </section>

          {/* Places Box */}
          <section className="info-box">
            <h2>Places to Visit in Pench National Park</h2>
            <p>
              Kohka Lake, Potter’s Village, Wolf Sanctuary and other scenic
              trails around the reserve.
            </p>
          </section>

          {/* CTA Box */}
          <section className="info-box cta-box">
            <p>
              Share your details with us using the form below and we’ll get back
              with the <strong>best available quotes</strong> — no hidden costs.
            </p>
          </section>
        </div>

        <form
          className="container contact-form"
          onSubmit={handleSubmit}
          style={{ padding: "70px", textAlign: "center" }}
        >
          <h2 className="form-title">Visitor Details Form</h2>

          <label className="form-label" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            placeholder="Enter your name"
            required
          />

          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-input"
            placeholder="Enter your email"
            required
          />

          <label className="form-label" htmlFor="number">
            Mobile Number
          </label>
          <input
            type="tel"
            id="number"
            name="number"
            className="form-input"
            placeholder="Enter your mobile number"
            required
          />

          <label className="form-label" htmlFor="date">
            Date of Visit
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className="form-input"
            required
          />

          <label className="form-label" htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            className="form-input"
            placeholder="Enter your message (optional)"
            rows="4"
          ></textarea>

          <button type="submit" className="submit-button">
            Send Details
          </button>
          {statusMessage && <p className="status-message">{statusMessage}</p>}
        </form>
        <br />
        <br />
        <div className="info-box">
          <h2>
            <strong>Address</strong>
          </h2>
          <ul>
            <li>
              Pench Tiger Reserve, B -43, Post Kurai, Turiya, Madhya
              Pradesh 480881
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
