import Hotel from "../models/hotel";
import fs from 'fs';
import { exec } from "child_process";

export const create = async(req, res) => {
    // console.log("REQ FIELDS", req.fields);
    // console.log("REQ Files", req.files);

    try {
        let fields = req.fields
        let files = req.files
        let hotel = new Hotel(fields)
        hotel.postedBy = req.user._id;

        //handle Image
        if(files.image) {
            hotel.image.data = fs.readFileSync(files.image.path);
            hotel.image.contentType = files.image.type;
        }

        hotel.save((err, result) => {
            if(err) {
                console.log("Saving hotel err => ", err);
                res.status(400).send('Error saving')
            }
            res.json(result)
        })


    } catch(err) {
        console.log(err)
        res.status(400).json({
            err: err.message
        })
    }

}

export const hotels = async(req, res) => {
    let all = await Hotel.find({})
    .limit(24)
    .select('-image.data')
    .populate('postedBy', '_id name')
    .exec();
    console.log(all);

    res.json(all)
}

export const image = async(req, res) => {
    let hotel = await Hotel.findById(req.params.hotelId).exec();
    if(hotel && hotel.image && hotel.image.data !== null) {
        res.set('Content-Type', hotel.image.contentType)
        return res.send(hotel.image.data);
    }
}

export const sellerHotels = async(req, res) => {
    let all = await Hotel.find({postedBy: req.user._id})
    .select('-image.data')
    .populate('postedBy', '_id, name')
    .exec();

    res.send(all)
}

export const remove = async(req, res) => {
    let removed = await Hotel.findByIdAndDelete(req.params.hotelId)
    .select('-image.data')
    .exec();
    res.json(removed)
}

export const read = async(req, res) => {
    let hotel = await Hotel.findById(req.params.hotelId)
    .populate("postedBy", '_id name' )
    .select("-image.data")
    .exec()
    res.json(hotel)
}

export const update = async(req, res) => {
    try {
        let fields = req.fields
        let files = req.files
        let data = {...fields}

        if(files.image) {
            let image = {}
            image.data = fs.readFileSync(files.image.path)
            image.contentType = files.image.type;

            data.image = image;
        }

        let updated = await Hotel.findByIdAndUpdate(req.params.hotelId, data, {
            new: true
        }).select("-image.data");

        res.json(updated)
    } catch(err) {
        console.log(err)
        res.status(400).send('Hotel Update Failed.Tey again !')
    }
}

export const searchListings = async(req, res) => {
    const {location, bed, date} = req.body;
    // console.log(location, bed, date);
    console.log(date);
  const fromDate = date.split(",");
  console.log(fromDate[0]);

    let result = await Hotel.find({
        from: { $gte: new Date(fromDate[0]) },
        location
    })
    .select('-image.data')
    .exec();
    res.json(result)
    console.log(result);
}