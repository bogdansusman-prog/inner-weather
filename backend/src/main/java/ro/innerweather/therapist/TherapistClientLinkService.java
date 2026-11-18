package ro.innerweather.therapist;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ro.innerweather.common.ApiException;
import ro.innerweather.user.Role;
import ro.innerweather.user.User;
import ro.innerweather.user.UserRepository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TherapistClientLinkService {

    private final TherapistClientLinkRepository links;
    private final TherapistProfileRepository therapists;
    private final UserRepository users;

    // clientul trimite cerere catre un terapeut (prin codul de invitatie)
    @Transactional
    public TherapistClientLinkResponse requestLink(UUID clientId, String inviteCode) {
        TherapistProfile therapist = therapists
                .findByInviteCodeAndStatus(inviteCode.trim().toUpperCase(), TherapistStatus.APPROVED)
                .orElseThrow(() -> ApiException.notFound("Unknown therapist code"));

        UUID therapistId = therapist.getUserId();

        if (links.existsByTherapistIdAndClientId(therapistId, clientId)) {
            throw ApiException.conflict("LINK_EXISTS", "A request already exists for this therapist");
        }

        TherapistClientLink link = new TherapistClientLink();
        link.setTherapistId(therapistId);
        link.setClientId(clientId);
        return TherapistClientLinkResponse.from(links.save(link));
    }

    // terapeutul vede cererile primite
    @Transactional(readOnly = true)
    public List<TherapistClientLinkResponse> getLinksForTherapist(UUID therapistId) {
        return links.findByTherapistId(therapistId)
                .stream()
                .map(TherapistClientLinkResponse::from)
                .toList();
    }

    // terapeutul accepta sau respinge o cerere
    @Transactional
    public TherapistClientLinkResponse updateStatus(UUID therapistId, UUID linkId, LinkStatus newStatus) {
        TherapistClientLink link = links.findById(linkId)
                .orElseThrow(() -> ApiException.notFound("Link not found"));

        if (!link.getTherapistId().equals(therapistId)) {
            throw ApiException.notFound("Link not found");
        }

        if (link.getStatus() != LinkStatus.PENDING) {
            throw ApiException.conflict("LINK_NOT_PENDING", "Link is already " + link.getStatus());
        }

        link.setStatus(newStatus);
        link.setUpdatedAt(Instant.now());
        return TherapistClientLinkResponse.from(links.save(link));
    }

    // clientul vede cererile lui
    @Transactional(readOnly = true)
    public List<TherapistClientLinkResponse> getLinksForClient(UUID clientId) {
        return links.findByClientId(clientId)
                .stream()
                .map(TherapistClientLinkResponse::from)
                .toList();
    }
}