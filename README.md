# Explanatory Debiasing
Explanatory Debiasing: Steering Generated Data Involving Domain Experts for Mitigating Representation Bias

## Abstract

Representation bias is one of the most common types of biases in artificial intelligence (AI) systems, causing AI models to perform poorly on underrepresented data segments. Although AI practitioners use various methods to reduce representation bias, their effectiveness is often constrained by insufficient domain knowledge in the debiasing process. To address this gap, this paper introduces a set of generic design guidelines for effectively involving domain experts in representation debiasing. We instantiated our proposed guidelines in a healthcare-focused application and evaluated them through a comprehensive mixed-methods user study with 35 healthcare experts. Our findings show that involving domain experts can reduce representation bias without compromising model accuracy. Based on our findings, we also offer recommendations for developers to build robust debiasing systems guided by our generic design guidelines, ensuring more effective inclusion of domain experts in the debiasing process.

<p align="center" width="100%">
<a href="https://youtu.be/eM_XB0W-Pvc" target="_blank"><img src="https://github.com/adib0073/explanatory_debiasing/blob/main/teaser_image.png" width="650" alt="EXDEB System"/></a>
</p>

## Recognition
This work received an honourable mention for best paper at ACM CHI 2025 and was presented at Yokohama, Japan for ACM CHI 2025.

<p align="center" width="100%">
<a href="https://youtu.be/eM_XB0W-Pvc" target="_blank"><img src="https://github.com/adib0073/explanatory_debiasing/blob/main/exdeb_screenshot.png
" width="650" alt="EXDEB System"/></a>
</p>


## Demo

Please check the demonstration for our EXMOS system:
<br/>
<br/>

[![Demo_Video](https://img.youtube.com/vi/eM_XB0W-Pvc/0.jpg)](https://youtu.be/eM_XB0W-Pvc)
<br/>
<br/>

## How to Get Started?
The source code for our React.js based front-end web application, FastAPI Python based backend application and deployment-ready docker configurations are available on GitHub: [https://github.com/adib0073/explanatory_debiasing](https://github.com/adib0073/explanatory_debiasing). You will also need to have docker and docker-compose installed in your system to seamlessly run the application.

**Step 1**: Since this application relies on MongoDB cloud for the backend data interaction. Please create your own MongoDB project to obtain the connection string and create the necessary databases and collections. Please refer this document for more information: [Getting started with MongoDB cloud](https://www.mongodb.com/docs/guides/atlas/connection-string/)

**Step 2**: Clone this repository and then update necessary constant values, such as, the `Mongo DB connection string`, `collection names` and `application URL` in 
```
EXMOS > app-api > app > constants.py
```
and 

```
explanatory_debiasing > app-ui > imports > ui > Constants.jsx
```
The search tag `<update_here>` will help you to find the constants that should be updated.

**Step 3**: Build the docker image. You need to have [Docker](https://www.docker.com) installed for building the docker image. The `docker-compose` and the `Dockerfile` files can be directly used to build the docker application. The build process can take up to 10 minutes to complete. Navigate to the location where you have `Dockerfile` and `docker-compose` using terminal or CLI tools and then use the command:
```
docker-compose build
```

**Step 4**: After the docker image is ready and the build process is successful, then use the following command to run the application:
```
docker-compose up --force-recreate
```
After the app is running successfully, you can open the base url of the app as mentioned in your configuration files to launch it in your web browser.

## Citation
If you use any parts of this work in your research, please cite us and all our related work as follows:

#### 1. From ACM CHI 2025

` ACM reference format `

Aditya Bhattacharya, Simone Stumpf, Robin De Croon, and Katrien Verbert. 2025. Explanatory Debiasing: Involving Domain Experts in the Data Generation Process to Mitigate Representation Bias in AI Systems. In Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems (CHI '25). Association for Computing Machinery, New York, NY, USA, Article 1119, 1–20. [https://doi.org/10.1145/3706598.3713497](https://doi.org/10.1145/3706598.3713497)


BibTex:

```
@inproceedings{BhattacharyaCHI2025,
author = {Bhattacharya, Aditya and Stumpf, Simone and De Croon, Robin and Verbert, Katrien},
title = {Explanatory Debiasing: Involving Domain Experts in the Data Generation Process to Mitigate Representation Bias in AI Systems},
year = {2025},
isbn = {9798400713941},
publisher = {Association for Computing Machinery},
address = {New York, NY, USA},
url = {https://doi.org/10.1145/3706598.3713497},
doi = {10.1145/3706598.3713497},
abstract = {Representation bias is one of the most common types of biases in artificial intelligence (AI) systems, causing AI models to perform poorly on underrepresented data segments. Although AI practitioners use various methods to reduce representation bias, their effectiveness is often constrained by insufficient domain knowledge in the debiasing process. To address this gap, this paper introduces a set of generic design guidelines for effectively involving domain experts in representation debiasing. We instantiated our proposed guidelines in a healthcare-focused application and evaluated them through a comprehensive mixed-methods user study with 35 healthcare experts. Our findings show that involving domain experts can reduce representation bias without compromising model accuracy. Based on our findings, we also offer recommendations for developers to build robust debiasing systems guided by our generic design guidelines, ensuring more effective inclusion of domain experts in the debiasing process.},
booktitle = {Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems},
articleno = {1119},
numpages = {20},
keywords = {Representation Bias, Bias detection, Debiasing, Explainable AI, XAI, Generative AI, GenAI, Responsible AI, Fair AI},
location = {
},
series = {CHI '25}
}
```



