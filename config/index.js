export default {
    vk: {
        phone: Number(process.env.VK_PHONE),
        pass: process.env.VK_PASSWORD,
        albumId: Number(process.env.VK_ALBUM_ID),
    },
    postTime: {
        every: 3600, //публиковать каждые N секунд
        randomOver: [1000, 2400], //случайное кол-во секунд сверху
        betweenHours: [10, 23] //часы между которыми возможна публикация
    }
};
