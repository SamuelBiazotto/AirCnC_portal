import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom"
import api from "../../services/api";
import Socket from "socket.io-client";
import "./styles.css";

export default function Dashboard() {
   const [spots, setSpots] = useState([]);
   const [requests, setRequests] = useState([]);

   const user_id = localStorage.getItem("user_id");
   const socket = useMemo(() => Socket("http://localhost:3000", {
      query: { user_id }
   }), [user_id]);

   useEffect(() => {
      socket.on("bookingRequest", data => {
         setRequests([...requests, data]);
      })

   }, [requests, socket]);

   useEffect(() => {
      async function loadSpots() {
         const user_id = localStorage.getItem("user_id");
         const response = await api.get("/dashboard", {
            headers: { user_id }
         });
         setSpots(response.data);
      }

      loadSpots();
   }, []) //utilizado para fazer filtros se necessário

   async function handleAccept (requestId) {
      await api.post(`/bookings/${requestId}/approvals`);

      setRequests(requests.filter( request => request._id != requestId));
   }

   async function handleReject(requestId) {
      await api.post(`/bookings/${requestId}/rejections`);

      setRequests(requests.filter( request => request._id != requestId)); 
   }


   return (
      <>
         <ul className="notifications">
            {requests.map(request => (
               <li key={request._id}>
                  <p>
                     <strong>{request.user.email}</strong> esta solicitando uma reserva em 
                     <strong> {request.spot.company}</strong> para a data: 
                     <strong> {request.date}</strong>
                  </p>
                  <button className="accept" onClick={() => handleAccept(request._id)}>ACEITAR</button>
                  <button className="reject" onClick={() => handleReject(request._id)}>RECUSAR</button>
               </li>
            ))}
         </ul>

         <ul className="spot-list">
            {spots.map(spot => (
               <li key={spot._id}>
                  <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
                  <strong>{spot.company}</strong>
                  <span>{spot.price ? `R$${spot.price}/dia` : "Gratuito"}</span>
               </li>
            ))}
         </ul>
         <Link to="/new">
            <button className="btn"> Cadastrar novo spot </button>
         </Link>
      </>
   )
}