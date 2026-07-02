import express from 'express';
import { PrismaClient } from "@prisma/client";
import path from "path";
import { fileURLToPath } from "url";

const app = express(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;


const prisma = new PrismaClient();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

// serve frontend
app.use(express.static(path.join(__dirname, "../public")));

app.post("/usuarios", async (req, res) => {
    const { name, company, giftId } = req.body;

    const user = await prisma.user.create({

        data: {

            name,
            company,
            giftId: giftId || null
        }

    });
    res.json(user)

})
app.post('/gifts', async (req, res) => {
    const { name, available } = req.body;

    const gift = await prisma.gift.create({
        data: {
            name,
            available
        }
    });

    res.json(gift);
});

// LIST
app.get("/gifts", async (req, res) => {
    const gifts = await prisma.gift.findMany();

    res.json(gifts);
});



app.put("/gifts/:id", async (req, res) => {
    const { id } = req.params;

    const gift = await prisma.gift.update({
        where: {
            id
        },
        data: {
            available: false
        }
    });

    res.json(gift);
});
app.get('/usuarios', async (req, res) => {
    const users = await prisma.user.findMany();
    const gifts = await prisma.gift.findMany();

    const usersWithGiftName = users.map((user) => {
        const gift = gifts.find((gift) => gift.id === user.giftId);

        return {
            id: user.id,
            name: user.name,
            company: user.company,
            giftId: user.giftId,
            giftName: gift ? gift.name : "Sem presente"
        };
    });

    res.json(usersWithGiftName);
});
app.put('/gifts/:id/available', async (req, res) => {
    const { id } = req.params;

    const gift = await prisma.gift.update({
        where: {
            id
        },
        data: {
            available: true
        }
    });

    res.json(gift);
});
app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});







