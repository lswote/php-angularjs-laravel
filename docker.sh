docker build -t teams . && docker run --name teamscontainer -p 8000:80 --rm -it --network=host teams
