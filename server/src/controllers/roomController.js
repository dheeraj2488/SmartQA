const { request } = require("express");
const Rooms = require("../models/Room");
const Questions = require("../models/Question");
const { callGemini } = require("../services/geminiService");

const roomController = {
    createRoom: async (request, response) => {
        try {
            const { createdBy } = request.body;

            const code = Math.random().toString(36)
                .substring(2, 8).toUpperCase();

            const room = await Rooms.create({
                roomCode: code,
                createdBy: createdBy
            });

            response.json(room);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    getByRoomId: async (request, response) => {
        try {
            const code = request.params.code;

            const room = await Rooms.findOne({ roomCode: code });
            if (!room) {
                return response.status(404).json({ message: 'Room not found' });
            }

            response.json(room);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    createQuestion: async (request, response) => {
        try {
            const { content, user } = request.body;
            const roomCode = request.params.code;

            const question = await Questions.create({
                roomCode: roomCode,
                content: content,
                user: user
            });

            response.json(question);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },

    getQuestions: async (request, response) => {
        try {
            const code = request.params.code;

            const questions = await Questions
                .find({ roomCode: code })
                .sort({ createdAt: -1 });
            
            response.json(questions);
        } catch (error) {
            console.log(error);
            response.status(500).json({ message: 'Internal server error' });
        }
    },
    summarizeQuestions: async (req, res) => {

        try {
            
            const {code} = req.params;
            const questions = await Questions.find({roomCode : code});

            if(!question || question.length === 0) {
                return res.status(404).json({ message: 'No questions found for this room' });
            }

            const summary = await callGemini(questions);
            res.json(summary);

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};

module.exports = roomController;