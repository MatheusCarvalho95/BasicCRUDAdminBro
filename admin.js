
//Configuring the database
const mongoose= require("mongoose");
const ProjectSchema = new mongoose.Schema({
    title: {
        type:String,
        required: true,
    },
    description: String,
    completed: Boolean,
    created_at:{type:Date, default: Date.now},
});

const Project = mongoose.model("Project", ProjectSchema);

//AdminBro config
const AdminBro = require("admin-bro");
const AdminBroExpress = require ("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");

//Using mongoose with AdminBro
AdminBro.registerAdapter(AdminBroMongoose);

//Configuration of AdminBro
const adminBroOptions = new AdminBro({
    resources: [{
        resource: Project, options:{
            properties:{
                description:{type: 'richtext'},
                created_at:{
                    isVisible:{edit:false,list:true,show:true,filter:true}
                }
            }
        }
    }],
    locale:{
        translations:{
            labels:{
                Project: "Meus projetos"
            }
        }
    },
    rootPath: "/admin"
});

//Routing
const router = AdminBroExpress.buildRouter(adminBroOptions);

//Basic server config
const express = require("express");
const server = express ()

server.use(adminBroOptions.options.rootPath, router);

//Async function to await the connection to database before listening to a port
const run = async () => {
    await mongoose.connect("mongodb://localhost/adminbroapp",{
        useNewUrlParser:true,
        useUnifiedTopology:true
    });
    await server.listen(5500, () => console.log("Started on 5500"))
}

run()