---
title: Understanding Triangles and Project Limits in Savrse Studio
slug: understanding-triangles-and-project-limits-in-savrse-studio
sidebar_position: 15
---
##### **What are Triangles in 3D models?**

In 3D graphics, triangles are the basic building blocks used to create 3D models

Every 3D object you see in a scene, such as furniture, buildings, or NPC, is made up of many small triangles connected together to form surfaces.

For example:

* A simple cube might have 12 triangles
* A detailed 3D character model may contain ten thousands of triangles

The more triangles a model has, the more detailed it can appear

However, more triangles also require more processing power to render

#### **Why does Savrse Studio limit the number of triangles?**

Savrse Studio worlds are designed to run smoothly across different devices, including VR environments

If a project contains too many triangles:

* Rendering performance may decrease
* Frame rates may drop
* Users may experience lag or discomfort in VR

To ensure a smooth experience, Savrse Studio sets a maximum triangle limit per project

#### **Triangle limit per project**

Currently, the maximum allowed number of triangles in a project is 2,000,000 triangles

If your project exceeds this limit, you will not be able to publish it until the triangle count is reduced

#### **How to reduce triangle count?**

If your project exceeds the triangle limit, you can optimize it using the following methods:

1. Use lower-poly models

Choose assets with fewer triangles whenever possible.
Low-poly models are optimized for real-time environments.

2. Reduce unnecessary objects

Remove objects that are not visible or not essential to the experience.

3. Replace highly detailed assets

Some assets may contain extremely high triangle counts.
Consider replacing them with optimized versions.

#### **Learn more about performance optimization**

Keeping triangle counts under control is one of the key steps in building optimized worlds.

For best results:

* Use optimized assets
* Avoid excessive object duplication
* Regularly check your project’s triangle count on Statistic
