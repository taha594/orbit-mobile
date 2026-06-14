import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useRequestStore } from "../store/requestStore";

export const useQuickActions = () => {
  const user = useAuthStore((state) => state.user);
  const requests = useRequestStore((state) => state.requests);
  const requestsLoading = useRequestStore((state) => state.requestsLoading);
  const requestsError = useRequestStore((state) => state.requestsError);
  const addRequest = useRequestStore((state) => state.addRequest);
  const updateRequest = useRequestStore((state) => state.updateRequest);
  const deleteRequest = useRequestStore((state) => state.deleteRequest);
  const loadRequests = useRequestStore((state) => state.loadRequests);

  useEffect(() => {
    if (user?.id) {
      loadRequests(user.id);
    }
  }, [user?.id, loadRequests]);

  return {
    user,
    requests,
    requestsLoading,
    requestsError,
    addRequest,
    updateRequest,
    deleteRequest,
    loadRequests,
  };
};
