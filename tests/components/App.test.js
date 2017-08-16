import React from 'react';
import { shallow } from 'enzyme';
import App from '../../app/components/App';

describe('App Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  it('should exist', () => {
    expect(wrapper).toBeTruthy();
  });
  
  it('should have one heading', () => {
    expect(wrapper.find('#heading').type()).toEqual('h2');
  });
});