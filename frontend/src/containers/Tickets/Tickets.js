import React, { Component } from 'react';
import { loadTickets } from '../../API/API'
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import TicketForm from '../../components/TicketForm/TicketForm';
import TicketCard from '../../components/TicketCard/TicketCard';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormGroup from "@material-ui/core/FormGroup";
import { Typography } from '@material-ui/core';
import { styles } from './TicketsStyle';


class Tickets extends Component {
    cookies = this.props.cookies
    
    state = {
        tickets: [],
        showAll: true,
        color: false,
        expanded: null
    }

    ticketsLoadedHandler = (tickets) => {
        this.setState({tickets: tickets.data});
    }
    
    claimPress = (ticket, user_id) => {
        let updatedTickets = this.state.tickets;
        let found = false;
        for (let i = 0; i < updatedTickets.length && !found; i++) {
            if (updatedTickets[i].id === ticket.id) {
                updatedTickets[i].claimer_id = user_id;
                found = true;
            }
        }
        this.setState({tickets: updatedTickets});        
        this.setState({color: false});
    }

    deleteTicket = (ticket) => {
        let updatedTickets = this.state.tickets;
        let found = false;
        let i;
        for (i = 0; i < updatedTickets.length && !found; i++) {
            if (updatedTickets[i].id === ticket.id) {
                found = true;
            }
        }
        updatedTickets.splice(i,1);
        this.setState({tickets: updatedTickets});
        this.setState({color: false});
    }

    componentDidMount () {
        console.log("getting tickets");
        loadTickets(this.ticketsLoadedHandler, this.props.cookies.get('token'));
    }

    toggleShow = () => {
        this.state.color = false;
        let showStatus = this.state.showAll;
        this.setState({showAll: !showStatus});
    }

    handleChange = (panelId) => {
        if (this.state.expanded !== panelId) {
            this.setState({expanded: panelId});
        } else {
            this.setState({expanded: null});            
        }
        this.setState({color: false})
    }
    
    render () {
        const { classes } = this.props;

        let t = this.state.tickets
        .filter((ticket) => !ticket.claimer_id || !this.state.showAll)
        .map(ticket =>{
            this.state.color = !this.state.color;
                return (
                    <TicketCard 
                        cookies = {this.cookies} 
                        ticket = {ticket} 
                        color = {this.state.color}
                        claimPress = {this.claimPress}
                        deleteTicket = {this.deleteTicket}
                        expanded = {this.state.expanded}
                        handleChange = {this.handleChange}
                        key = {ticket.id}
                    ></TicketCard>
                )
            });
        

        if (!this.cookies.get('token')) {
            return (
                <Grid container >
                    <Grid item xs = {4} ></Grid>
                    <Grid item xs = {4} >
                        <Card className = {classes.card} >
                            <Typography
                                component="h1" 
                                variant="h5"
                                className = {classes.errorText}
                            >You must <a className = {classes.errorLink} href='/log-in'>log in</a> before</Typography>
                        </Card>
                    </Grid>
                <Grid item xs={4}></Grid>
            </Grid>
            )
        }

        if (this.cookies.get('is_hacker') === "true") {
            return (
                <Grid container >
                    <Grid item xs = {4} ></Grid>
                    <Grid item xs = {4} >
                        <Card className = {classes.card} >
                            <TicketForm cookies={this.cookies}></TicketForm>
                        </Card>
                    </Grid>
                <Grid item xs={4}></Grid>
            </Grid>
            )
        }

        return (
            <Grid container >
                <Grid item xs = {3} ></Grid>
                <Grid item xs = {6} >
                    <Card className = {classes.card} >
                        <Grid container >
                            <Grid item xs= {10}>
                                <Typography
                                    variant = 'h4'
                                    className = { classes.title }
                                >Tickets</Typography>
                            </Grid>
                            <Grid item xs = {2} >
                                <FormGroup>
                                    <FormControlLabel
                                        value="start"
                                        control={<Switch
                                                onChange = {this.toggleShow}
                                            ></Switch>}
                                        label="Claimed"
                                        labelPlacement="start"
                                        className = { classes.switch }
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                            {t}
                        </Card>
                    </Grid>
                <Grid item xs={3}></Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Tickets);