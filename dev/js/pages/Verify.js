import React, {Component} from 'react';
import VerificationNotice from '../components/VerificationNotice';
import PreLoader from '../components/PreLoader';
import qs from 'query-string';
import $ from 'jquery';

export default class Verify extends Component {
        constructor(props) {
        super(props);
        
        // Get query params from URL
        //Sample URL: practically-limitless.herokuapp.com/verify?email=ian@goyeti.ie&token=c1c69de13a5e03e7e85fcc391014ae2bddebb3925e78bbe7d7c33c82eb2ffdad  
        let userEmail = qs.parse(this.props.location.search).email;
        let userToken = qs.parse(this.props.location.search).token;	
        
        // initialise state
        this.state = {
            email: userEmail,
            token: userToken,
            verificationStatus: false,
            checkComplete: false,
            title: "", 
            subTitle: "",
            linkText: "",
            linkLocation: ""
        }
        
        this.checkVerification = this.checkVerification.bind(this);
    }

    componentDidMount() {
        // if query params are present, begin verification check.
        if(this.state.email && this.state.token) {   
            this.checkVerification();
        } else {
            this.setState({
                checkComplete: true,
                title: "Error!", 
                subTitle: "Oops...I think you have come here by mistake.",
                linkText: "Return Home",
                linkLocation: "/home"
            });
        }
    }
    
    checkVerification() {
        let me = this;

        setTimeout(function() { 
            $.ajax({
                method: 'POST',
                data: {
                    token: me.props.token,
                    action: 'activateCompany',
                    data: JSON.stringify({email: me.state.email, token: me.state.token})
                },
                url: 'public/process.php',
                success: function(res) {
                    if(res.responseCode === 200) {
                        me.setState({
                            verificationStatus: true,
                            checkComplete: true,
                            title: "Success!", 
                            subTitle: "You can now proceed to login.",
                            linkText: "Login",
                            linkLocation: "/home"
                        });
                    } else {
                        me.setState({
                            checkComplete: true,
                            title: "Error!", 
                            subTitle: "There was a problem with your verification. Please register again.",
                            linkText: "Register",
                            linkLocation: "/home"
                        });
                    }
                    
                },
                error: function(res) {
                    me.setState({
                        checkComplete: true
                    });
                }
            });
            
        }, 500);
    }

    render() {
        return(
            <div className="verify-page__container">
                {this.state.checkComplete ? (
                    <VerificationNotice 
                        verificationStatus={this.state.verificationStatus} 
                        title={this.state.title} 
                        subTitle={this.state.subTitle}  
                        linkText={this.state.linkText}
                        linkLocation={this.state.linkLocation} />
                ) : (
                    <PreLoader />
                )}
            </div>
        );
    }
}