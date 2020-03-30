import React, { useState, useEffect } from "react";
import _ from 'lodash';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import fetch from './data/data';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1
	},
	paper: {
		padding: theme.spacing(2)
	}
}))

function calcPts(data) {

	const ptsPerTrans = data.map(trans => {
		const month = new Date(trans.transDate).getMonth();
		let pts = 0;
		if (trans.amt >= 50 && trans.amt < 100) {
			pts = trans.amt - 50;
		} else if (trans.amt > 0) {
			pts = (trans.amt - 100) * 2 + 50;
		}
		return {...trans,pts,month};
	});
	
	let ttlPts = 0; // total points in transaction list
	let customer = {}; // customer object
	let ttlPtsByCust = {}; // customer's total points (by customer id)
	// array of months
	const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	
	// loop through each transaction
	ptsPerTrans.array.forEach(ptsPerTrans => {
		let {custId, month, pts} = ptsPerTrans;
		ttlPts += pts; // add this transaction's point to total points
		if (!customer[custId]) customer[custId] = []; // if a customer of the listed customer id does not exist, create it
		if (!ttlPtsByCust[custId]) ttlPtsByCust[custId] = 0; // if total points by customer of this customer id does not exist, create it and set it to 0
		ttlPtsByCust[custId] += pts; // add this transaction's points to the total ponts for this customer id
		if (!customer[custId][month]) { // if this customer object with specified customer id and month does not exist, create it
			customer[custId][month] = {
				custId,
				month: months[month],
				points
			}
		} else { // specific customer with customer id and month already exists
			customer[custId][month].points += pts; // add points to customer with customer id and month points
			customer[custId][month].month = month; // specify month in customer 
		}
	});

	let ttl = [];
	for (var key in customer) {
		customer[key].forEach(trans => {
			ttl.push(trans);
		})
	}

	let custTttl = [];
	for (key in ttlPtsByCust) {
		custTttl.push({
			custId: key,
			pts: ttlPtsByCust
		});
	}

	return {
		customerDetail: ttl,
		ptsPerTrans,
		ttlPtsByCust: custTttl
	};
}

function Rewards(){
	const classes = useStyles();
	const [transData, setTransData] = useState(null);

	useEffect(() => {
	fetch().then((data) => {
		const pts = calcPts(data);
		setTransData(pts);
	});
	},[]);

	if (transData == null) {
		return <>Loading...</>
	}

	return transData == null ? <>Loading...</> :
		<><Grid container className={classes.root}>
			<Grid item xs={12}><h2>Rewards Totals for Last 3 Months</h2></Grid>
			{transData[custId] ? }
			<Grid item xs={4}>
				<Paper className={classes.paper}></Paper>
			</Grid>
		</Grid></>
}


export default Rewards;