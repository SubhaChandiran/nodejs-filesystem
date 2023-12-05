const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Local storage for data
let rooms = [];
let bookings = [];

// Create a Room
app.post("/createRoom", (req, res) => {
  const { roomName, seats, amenities, pricePerHour } = req.body;
  const room = {
    roomName,
    seats,
    amenities,
    pricePerHour,
  };
  rooms.push(room);
  res.json({ message: "Room created successfully", room });
});

// Book a Room
app.post("/bookRoom", (req, res) => {
  const { customerName, date, startTime, endTime, roomId } = req.body;
  const room = rooms.find((r) => r.roomName === roomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const booking = {
    customerName,
    date,
    startTime,
    endTime,
    roomId,
  };
  bookings.push(booking);
  res.json({ message: "Room booked successfully", booking });
});

// List all Rooms with Booked Data
app.get("/listAllRooms", (req, res) => {
  const result = rooms.map((room) => {
    const booking = bookings.find((b) => b.roomId === room.roomName);
    return {
      roomName: room.roomName,
      bookedStatus: booking ? "Booked" : "Available",
      customerName: booking ? booking.customerName : null,
      date: booking ? booking.date : null,
      startTime: booking ? booking.startTime : null,
      endTime: booking ? booking.endTime : null,
    };
  });
  res.json(result);
});

// List all customers with booked Data
app.get("/listAllCustomers", (req, res) => {
  const result = bookings.map((booking) => {
    const room = rooms.find((r) => r.roomName === booking.roomId);
    return {
      customerName: booking.customerName,
      roomName: room ? room.roomName : null,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    };
  });
  res.json(result);
});

// List how many times a customer has booked the room
app.get("/customerBookingHistory/:customerName", (req, res) => {
  const { customerName } = req.params;
  const result = bookings
    .filter((booking) => booking.customerName === customerName)
    .map((booking) => ({
      customerName: booking.customerName,
      roomName: booking.roomId,
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
      bookingId: bookings.indexOf(booking) + 1,
      bookingDate: new Date().toISOString(),
      bookingStatus: "Booked",
    }));
  res.json(result);
});

// API Documentation using Postman Docs format
const postmanDocs = {
  info: {
    name: "Hall Booking API",
    description: "API for managing hall bookings",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Development Server",
    },
  ],
  paths: {
    "/createRoom": {
      post: {
        summary: "Create a Room",
        requestBody: {
          content: {
            "application/json": {
              example: {
                roomName: "Room1",
                seats: 50,
                amenities: ["Projector", "Whiteboard"],
                pricePerHour: 100,
              },
            },
          },
        },
        responses: {
          200: {
            description: "Room created successfully",
          },
          400: {
            description: "Invalid request format",
          },
        },
      },
    },
    "/bookRoom": {
      post: {
        summary: "Book a Room",
        requestBody: {
          content: {
            "application/json": {
              example: {
                customerName: "John Doe",
                date: "2023-12-01",
                startTime: "09:00",
                endTime: "11:00",
                roomId: "Room1",
              },
            },
          },
        },
        responses: {
          200: {
            description: "Room booked successfully",
          },
          400: {
            description: "Invalid request format",
          },
          404: {
            description: "Room not found",
          },
        },
      },
    },
    "/listAllRooms": {
      get: {
        summary: "List all Rooms with Booked Data",
        responses: {
          200: {
            description: "List of rooms with booked data",
          },
        },
      },
    },
    "/listAllCustomers": {
      get: {
        summary: "List all customers with booked Data",
        responses: {
          200: {
            description: "List of customers with booked data",
          },
        },
      },
    },
    "/customerBookingHistory/{customerName}": {
      get: {
        summary: "List how many times a customer has booked the room",
        parameters: [
          {
            name: "customerName",
            in: "path",
            required: true,
            schema: {
              type: "string",
            },
          },
        ],
        responses: {
          200: {
            description: "Booking history of the customer",
          },
        },
      },
    },
  },
};

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
