import React from "react";
import { mount } from "enzyme";

import { SearchProvider, WithSearch } from "../";
import { APIConnector } from "@elastic/search-ui";

describe("WithSearch", () => {
  const mockApiConnector: APIConnector = {
    onSearch: jest.fn(),
    onAutocomplete: jest.fn(),
    onResultClick: jest.fn(),
    onAutocompleteResultClick: jest.fn(),
    state: {}
  };

  it("exposes state and actions to components", () => {
    const wrapper = mount(
      <SearchProvider
        config={{
          apiConnector: mockApiConnector,
          initialState: {
            searchTerm: "test"
          },
          onSearch: () => {
            return {
              then: () => ({})
            };
          }
        }}
      >
        <WithSearch mapContextToProps={({ searchTerm }) => ({ searchTerm })}>
          {({ searchTerm }) => <div>{searchTerm}</div>}
        </WithSearch>
      </SearchProvider>
    );
    expect(wrapper.text()).toEqual("test");
  });

  describe("mapContextToProps", () => {
    function setup(mapContextToProps) {
      return mount(
        <SearchProvider
          config={{
            apiConnector: mockApiConnector,
            initialState: {
              resultsPerPage: 90,
              searchTerm: "test"
            },
            onSearch: () => {
              return {
                then: () => ({})
              };
            }
          }}
        >
          <WithSearch mapContextToProps={mapContextToProps}>
            {({ searchTerm, resultsPerPage, setResultsPerPage }) => (
              <div>
                {searchTerm}
                {resultsPerPage}
                {setResultsPerPage && typeof setResultsPerPage}
              </div>
            )}
          </WithSearch>
        </SearchProvider>
      );
    }

    it("can inject state", () => {
      const mapContextToProps = ({ resultsPerPage }) => ({
        resultsPerPage
      });
      const wrapper = setup(mapContextToProps);
      expect(wrapper.text()).toEqual("90");
    });

    it("can inject actions", () => {
      const mapContextToProps = ({ setResultsPerPage }) => ({
        setResultsPerPage
      });
      const wrapper = setup(mapContextToProps);
      expect(wrapper.text()).toEqual("function");
    });
  });
});
