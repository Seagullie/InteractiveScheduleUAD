const mockNetInfo = {
  fetch: jest.fn().mockResolvedValue({
    isConnected: true,
    isInternetReachable: true,
  }),
}

export default mockNetInfo
