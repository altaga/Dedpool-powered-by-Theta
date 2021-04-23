# Dedpool powered by Theta
 Dedpool Dynamic Gambling for League of Legends Powered by Theta

 # Table of Contents:

- [Dedpool powered by Theta](#dedpool-powered-by-theta)
- [Table of Contents:](#table-of-contents)
- [Introduction:](#introduction)
- [Solution:](#solution)
- [Software and Services:](#software-and-services)
- [Development:](#development)
  - [Backend:](#backend)
  - [Frontend:](#frontend)
  - [Logic Examples:](#logic-examples)
- [AI Diagram:](#ai-diagram)
- [Real Time Demo:](#real-time-demo)
- [VM Setup:](#vm-setup)
- [Cool Video:](#cool-video)

# Introduction

According to CNN, eSports describes the world of competitive, organized video gaming. Gamers are watched and followed by millions of people all over the world. Fans attend live events or tune in on TV or online. Even streaming services like Twitch, FB Gaming, and others allow viewers to watch as their favorite gamers play in real-time. On those sites is where popular gamers build up their fandoms.

The ESports market is growing;
<img src="https://cdn.cnn.com/cnnnext/dam/assets/160530101317-esports-global-market-graphic-exlarge-169.jpg">

But even from 2019 to 2023 it is expected to continue growing. According to Business Insider, it is expected to grow at a 9% CARG up from 454 million in 2019 to 646 million in 2023. The esports audience will grow on pace to nearly double over a six-year period, as the 2017 audience stood at 335 million. 

Most projections put the esports ecosystem on track to surpass $1 billion in revenue for the first time this year. And revenue is expected to grow from here — Newzoo projects it to hit $1.8 billion by 2022. Money flows into esports through media rights, live event ticket sales, merchandise sales, and in-game purchases, but most of the revenue (69%) comes from sponsorships and advertising, per Newzoo figures cited by Statista.

###  Betting Market.

Sports betting is a form of gambling in a specific sporting event. Alongside with the odds are the prizes you can possibly win and the amount you need to gamble. As a result, a lot of people are encouraged to watch many sporting events today for the sole purpose of sports betting.

The global sports betting industry reached a market size of 203 billion U.S. dollars in 2020. Within this industry, there were approximately 197 thousand employees in a total of almost 31 thousand businesses. Many countries participate in legal sports betting, one of the more recent being the United States in 2019. Sports betting revenue in the U.S. was predicted to grow to as much as eight billion U.S. dollars by 2025.

Also, 45% of sports betting now takes place online; online gambling is available any time, providing more convenience and privacy.

But, there's one aspect of it that has grown substantially which is eSports betting.
The eSports betting market wagers grew exponentially worldwide between 2015 and 2020. According to the source, the amounts wagered on eSports betting grew from 315 million U.S. dollars to 23.5 billion in the presented period according to Statista (6).

Among the biggest sites that also manage eSports betting we find the following:

<img src="https://sgamingzionm.gamblingzion.com/uploads/2017/05/esports-mashup_2.jpg">

### Steaming platforms

ESports’ bets are becoming increasingly complex, there are sites with multipliers that change according to the statistics and the teams. But not even one site allows you to bet for specific circumstances of the game. 

<img src="https://assets.help.twitch.tv/article/img/000002309-01.png">

Even Twitch has introduced predictions. It is a new feature on the site that allows streamers to ask the possible outcome of certain scenarios. Viewers bet their channel points and all these aspects bring a new experience for the viewers. Streamers have a new engagement tool with their audience. The main problem with this feature is that it only allows ONE bet during a game. Also the streamer must create the poll every time. 

#### What if we can bring that to Theta?

#### Improve it considerably and bring a new dimension of interactivity to the streaming ecosystem?

#### And instead of channel points, using Theta fuel that is collected by watching those same streams.

# Software and Services:

Software:
- Docker:
https://www.docker.com/
- Python:
https://www.python.org/
- Golang:
https://golang.org/
- OpenCV:
https://opencv.org/
- NodeJS:
https://nodejs.org/
- ReactJS:
https://reactjs.org/

Services:

- AWS EC2:
https://aws.amazon.com/aws/ec2
- AWS S3:
https://aws.amazon.com/aws/s3
- Flespi MQTT:
https://flespi.com
- TensorFlow:
https://www.tensorflow.org
- Theta Ledger:
https://github.com/thetatoken/theta-protocol-ledger

# Development:

## Backend:
On the backend we have 2 servers running at the same time.

One of the servers, in this case an AWS EC2, x64 CPU. The theta Ledger is running on it, which is in charge of confirming and executing all the transactions of our betting system.

<img src="./Images/thetaserver.png">

Transaction Example:

<img src="./Images/thetaserver2.png">

The second server is an ARM Cortex-A57 CPU with NVIDIA Maxwell 128 GPU. It is performing the analysis of the games transmitted by Theta.tv in real time, that is, it performs the analysis of the game while the streamer is transmitting it. 

<img src="./Images/aiserver.png"> 

For this Proof of Concept it was decided that the ideal game to do this would be Legue of Legends due to its pronounced popularity over the years.

The transmission of information from the servers and the web platform is through MQTT, due to its excellent response time.

<img src="./Images/mqtts.png"> 

## Frontend:

The Dedpool platform receives the data directly from the game through MQTT and by means of simple logic it manipulates the bets in such a way that they are dynamic throughout the game, here are some examples of the logic of the platform.

<img src="./Images/template.png">

## Logic Examples:

Win Event:

|     Score Board                      | Score  |
|--------------------------------------|--------|
|     > 3 kills for the allied team      | 2:1    |
| > 3   kill against the allied team     | 1:2    |
| > 6   kills for the allied team        | 3:1    |
| > 6   kill against the allied team     | 1:3    |
| > 10   kills for the allied team       | 5:1    |
| > 10   kill against the allied team    | 1:5    |
| > 15   kills for the allied team      | 10:1   |
| > 15   kill against the allied team   | 1:10   |
| > 30   kills for the allied team      | 50:1   |
| > 30   kill against the allied team   | 1:50   |
| > 50   kills for the allied team      | 100:1  |
| > 50   kill against the allied team   | 1:100  |
| > 100   kills for the allied team     | 1000:1 |
| > 100   kill against the allied team  | 1:1000 |

First Blood Event:

| Timer                      | Bet  |
|----------------------------|------|
| 30 Seconds to 2:00 minutes | 1:10 |
| 2:00 to 3:00 minutes       | 1:5  |
| 3:00 to 4:00 minutes       | 1:3  |
| after 4:00 minutes         | 1:1  |

# AI Diagram:

The events, score and game time are obtained by analyzing the characters on the screen, using a character recognition library such as Google's Tesseract OCR. For this we employ machine learning models based on mnist through the tensorflow framework, specially trained to recognize more specific characters such as score and starting time.

<img src="./Images/ai.png">

# Demo Real Time:

https://youtu.be/fRAGp-0K0b0

# VM Setup:

Original Repository: https://github.com/thetatoken/theta-protocol-ledger

In order to install the Theta ledger, we had to make a x84 virtual machine.

The entire installation was done through a Docker container, due to its ease of exportability and installation.

In order to install the container and run it properly we have to install Docker on the computer that is going to be used and once the installer is installed, run the following commands:

    docker build -t Theta_Ledger .
    docker run Theta_Ledger

All the container details are in the Dockerfile.

# Cool Video:

https://youtu.be/W4QksA5qlTU

# Theta Test Stream:

![image](https://user-images.githubusercontent.com/36020837/115928294-7f4a2480-a44b-11eb-82a7-d7d9c5319987.png)
https://www.theta.tv/video/vid9iig80weetgf30t6

